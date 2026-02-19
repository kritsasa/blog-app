import Image from "next/image";
import Link from "next/link";
import {
  FaGithub,
  FaHtml5,
  FaCss3,
  FaReact,
  FaNodeJs,
  FaDocker,
} from "react-icons/fa";
import { IoLogoJavascript } from "react-icons/io5";
import { RiTailwindCssFill, RiNextjsFill } from "react-icons/ri";
import { BiLogoTypescript, BiLogoPostgresql } from "react-icons/bi";
import { SiPrisma, SiMongodb, SiMysql } from "react-icons/si";

const techStack = [
  { icon: FaHtml5, color: "text-orange-500" },
  { icon: FaCss3, color: "text-blue-500" },
  { icon: IoLogoJavascript, color: "text-yellow-400" },
  { icon: BiLogoTypescript, color: "text-blue-500" },
  { icon: FaNodeJs, color: "text-green-500" },
  { icon: FaReact, color: "text-blue-400" },
  { icon: RiNextjsFill, color: "text-gray-100" },
  { icon: RiTailwindCssFill, color: "text-sky-400" },
  { icon: FaDocker, color: "text-blue-400" },
  { icon: SiMysql, color: "text-blue-600" },
  { icon: BiLogoPostgresql, color: "text-blue-600" },
  { icon: SiMongodb, color: "text-green-600" },
  { icon: SiPrisma, color: "text-gray-100" },
  { icon: FaGithub, color: "text-gray-100" },
];

function getAge(birthDate: string | Date): number {
  const today = new Date();
  const birth = new Date(birthDate);

  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }

  return age;
}


export default function AboutPage() {
  return (
    <section className="min-h-screen bg-black flex items-center justify-center px-6">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-xl sm:text-3xl font-bold text-emerald-500 mb-6">
            I am Kritsada, a Full-Stack Developer.
          </h1>

          <div className="space-y-4 text-sm">
            <Info label="NAME" value="Kritsada Mooljam (P)" />
            <Info label="ROLE" value="Full-Stack Developer (Student)" />
            <Info label="AGE" value={`${getAge("2006-09-19")}`} />
            <Info label="LOCATION" value="Chiang Rai, Thailand" />

            <div>
              <p className="font-semibold text-gray-400 mb-2">TECH STACK</p>
              <div className="flex flex-wrap gap-3">
                {techStack.map(({ icon: Icon, color }, i) => (
                  <Icon key={i} size={22} className={color} />
                ))}
              </div>
            </div>
          </div>

          <Link
            href="/contact"
            className="mt-8 inline-flex items-center gap-2 rounded-lg
                       border border-emerald-500 px-4 py-3
                       font-semibold text-emerald-500
                       hover:bg-emerald-500 hover:text-black
                       transition mr-4"
          >
            Contact Me
          </Link>
          <Link
            href="https://github.com/kritsada19"
            target="_blank"
            className="mt-8 inline-flex items-center gap-2 rounded-lg
                       border border-emerald-500 px-4 py-3
                       font-semibold text-emerald-500
                       hover:bg-emerald-500 hover:text-black
                       transition"
          >
            Github <FaGithub />
          </Link>
        </div>

        <div className="relative flex justify-center">
          <div className="absolute w-60 h-60 sm:w-96 sm:h-96 rounded-full bg-emerald-500 right-6 -top-6 sm:-right-6" />

          <Image
            src="/images/profile.jpg"
            alt="Kritsada profile"
            width={384}
            height={384}
            className="relative w-60 h-60 sm:w-96 sm:h-96 rounded-full object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="font-semibold text-gray-400">{label}</p>
      <p className="text-emerald-500">{value}</p>
    </div>
  );
}
