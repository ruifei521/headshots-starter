// 清理重复的 credits 记录，只保留每个 user_id 的最新一条
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://vgrqvwhkvnqsawlwywld.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZncnF2d2hrdm5xc2F3bHd5d2xkIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3Nzg1NDAwMCwiZXhwIjoyMDkzNDEzNzU1fQ.Q3C_DQiifyMgidhidqD_0K0E9Ne7oiEsCZR0NGSXKo'
);

async function cleanDuplicates() {
  // 1. 查出所有有重复的 user_id
  const { data: allCredits, error } = await supabase
    .from('credits')
    .select('id, user_id, created_at')
    .order('user_id')
    .order('id', { ascending: false });

  if (error) {
    console.error('Error fetching credits:', error);
    return;
  }

  // 2. 找出每个 user_id 的最新记录（id 最大的），其余删除
  const latestById = new Map();
  for (const row of allCredits) {
    if (!latestById.has(row.user_id)) {
      latestById.set(row.user_id, row.id);
    }
  }

  const idsToKeep = new Set(latestById.values());
  const idsToDelete = allCredits
    .map(r => r.id)
    .filter(id => !idsToKeep.has(id));

  console.log(`Total records: ${allCredits.length}`);
  console.log(`Records to keep: ${idsToKeep.size}`);
  console.log(`Records to delete: ${idsToDelete.length}`);
  console.log('IDs to delete:', idsToDelete);

  if (idsToDelete.length === 0) {
    console.log('No duplicates to clean.');
    return;
  }

  // 3. 删除重复记录
  const { error: deleteError } = await supabase
    .from('credits')
    .delete()
    .in('id', idsToDelete);

  if (deleteError) {
    console.error('Error deleting duplicates:', deleteError);
  } else {
    console.log(`Successfully deleted ${idsToDelete.length} duplicate records.`);
  }
}

cleanDuplicates();
