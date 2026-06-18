import Image from "next/image";

export default function TrustedByLogos() {
  return (
    <div className="w-full py-6">
      <p className="text-center text-sm font-semibold text-muted-foreground mb-5 tracking-wide uppercase">
        Trusted by professionals and teams
      </p>
      <div className="flex justify-center px-4">
        <Image
          src="/trusted-by-logos.png"
          alt="Trusted by professionals and teams"
          width={800}
          height={80}
          className="max-w-full h-auto opacity-70 hover:opacity-100 transition-opacity"
          loading="lazy"
        />
      </div>
    </div>
  )
}
