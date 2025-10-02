import { Header } from "@/components/header"
import { About } from "@/components/about"
import { Skills } from "@/components/skills"
import { Projects } from "@/components/projects"
import { Experience } from "@/components/experience"
import { Education } from "@/components/education"
import { Extras } from "@/components/extras"
import { Contact } from "@/components/contact"
import { AdminLogin } from "@/components/admin-login"

export default function Home() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="lg:ml-64">
        <About />
        <Skills />
        <Projects />
        <Experience />
        <Education />
        <Extras />
        <Contact />
      </main>
      <AdminLogin />
    </div>
  )
}
