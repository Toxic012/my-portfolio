"use client"

import type React from "react"

import { Mail, Phone, Linkedin, Github, Download, Upload, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAdmin } from "@/lib/admin-context"
import { useState, useEffect } from "react"

const socialLinks = [
  {
    name: "LinkedIn",
    href: "www.linkedin.com/in/a-ozair",
    icon: Linkedin,
  },
  {
    name: "GitHub",
    href: "https://github.com/Toxic012",
    icon: Github,
  },
]

export function About() {
  const { isEditMode } = useAdmin()
  const [resumeUrl, setResumeUrl] = useState<string | null>(null)
  const [resumeName, setResumeName] = useState<string>("")

  useEffect(() => {
    const savedResume = localStorage.getItem("resume-url")
    const savedName = localStorage.getItem("resume-name")
    if (savedResume) setResumeUrl(savedResume)
    if (savedName) setResumeName(savedName)
  }, [])

  const handleResumeUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setResumeUrl(base64String)
        setResumeName(file.name)
        localStorage.setItem("resume-url", base64String)
        localStorage.setItem("resume-name", file.name)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleResumeDelete = () => {
    setResumeUrl(null)
    setResumeName("")
    localStorage.removeItem("resume-url")
    localStorage.removeItem("resume-name")
  }

  const handleResumeDownload = () => {
    if (resumeUrl) {
      const link = document.createElement("a")
      link.href = resumeUrl
      link.download = resumeName || "resume.pdf"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <section id="about" className="min-h-screen flex items-center px-6 md:px-12 lg:px-20 py-20 lg:py-0">
      <div className="max-w-4xl w-full animate-fade-in">
        <h2 className="text-sm font-mono text-primary mb-4">Hi, my name is</h2>
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-4">Md Ammar Ozair</h1>
        <h3 className="text-3xl md:text-5xl lg:text-6xl font-bold text-muted-foreground mb-8">
          I build things for the web and AI.
        </h3>

        <div className="space-y-4 text-muted-foreground leading-relaxed max-w-2xl mb-8">
          <p>
            Hi ,I am Md Ammar Ozair, a passionate Computer Science student with a strong interest in Machine Learning and Artificial Intelligence.
            I am currently pursuing a degree in Information Technology at CMR Technical Campus, Hyderabad, and I am in my 3rd year of studies.
          </p>
          <p>
            I strive to create projects that save time and deliver real value, with a focus on building solutions that 
            make processes easier, more efficient, and user-friendly. My goal is to deepen my expertise in AI and develop
            innovative technologies that reduce human effort and solve real-world challenges.
          </p>
          <p>
            I strongly believe in the power of technology to transform lives and create meaningful impact. Beyond coding,
            I enjoy exploring the latest technology trends, studying entrepreneurship ideas, and staying updated with 
            advancements in AI and software engineering.
          </p>
        </div>

        <div className="mb-8 p-6 bg-card border border-border rounded-lg">
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            <Download className="w-5 h-5 text-primary" />
            Resume
          </h3>

          {resumeUrl ? (
            <div className="flex flex-wrap items-center gap-4">
              <Button
                onClick={handleResumeDownload}
                className="bg-primary text-primary-foreground hover:bg-primary/90 glow-on-hover"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Resume
              </Button>

              {isEditMode && (
                <>
                  <label className="cursor-pointer">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary/10 bg-transparent"
                      onClick={() => document.getElementById("resume-update")?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Update Resume
                    </Button>
                    <input
                      id="resume-update"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      className="hidden"
                    />
                  </label>

                  <Button
                    onClick={handleResumeDelete}
                    variant="outline"
                    className="border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Resume
                  </Button>
                </>
              )}

              {resumeName && <span className="text-sm text-muted-foreground">Current: {resumeName}</span>}
            </div>
          ) : (
            <div>
              {isEditMode ? (
                <label className="cursor-pointer">
                  <Button
                    type="button"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 glow-on-hover"
                    onClick={() => document.getElementById("resume-upload")?.click()}
                  >
                    <Upload className="w-4 h-4 mr-2" />
                    Upload Resume
                  </Button>
                  <input
                    id="resume-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    onChange={handleResumeUpload}
                    className="hidden"
                  />
                </label>
              ) : (
                <p className="text-sm text-muted-foreground">No resume uploaded yet.</p>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          <a
            href="mail to : ammarozair16@gmail.com"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Mail className="w-4 h-4" />
            ammarozair16@gmail.com
          </a>
          <a
            href="tel:+91 9304135335"
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            <Phone className="w-4 h-4" />
            +91 9304135335
          </a>
        </div>

        <div className="flex gap-4">
          {socialLinks.map((link) => {
            const Icon = link.icon
            return (
              <Button
                key={link.name}
                variant="outline"
                size="icon"
                asChild
                className="hover:border-primary hover:text-primary transition-all hover:scale-110 bg-transparent border-primary text-primary glow-on-hover"
              >
                <a href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.name}>
                  <Icon className="w-5 h-5" />
                </a>
              </Button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
