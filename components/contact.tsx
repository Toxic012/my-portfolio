"use client"

import { Mail, Linkedin, Github, ExternalLink, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"

const contactLinks = [
  {
    name: "Email",
    value: "ammarozair16@gmail.com",
    href: "mail t o: ammarozair16@gmail.com",
    icon: Mail,
  },
  {
    name: "Phone",
    value: "+91 93041 35335",
    href: "tel:+919304135335",
    icon: Phone,
  },
  {
    name: "LinkedIn",
    value: "linkedin.com/in/ammarozair",
    href: "www.linkedin.com/in/a-ozair",
    icon: Linkedin,
  },
  {
    name: "GitHub",
    value: "github.com/ammarozair",
    href: "https://github.com/Toxic012",
    icon: Github,
  },
]

export function Contact() {
  return (
    <section id="contact" className="min-h-screen flex items-center px-6 md:px-12 lg:px-20 py-20">
      <div className="max-w-2xl w-full mx-auto text-center">
        <h2 className="text-sm font-mono text-primary mb-4 animate-fade-in">What's Next?</h2>
        <h3 className="text-4xl md:text-5xl font-bold text-foreground mb-6 animate-slide-up">Get In Touch</h3>
        <p className="text-muted-foreground leading-relaxed mb-12 max-w-xl mx-auto animate-fade-in">
          I'm currently looking for new opportunities and my inbox is always open. Whether you have a question or just
          want to say hi, I'll try my best to get back to you!
        </p>

        <div className="space-y-4 mb-12">
          {contactLinks.map((link) => {
            const Icon = link.icon
            return (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-4 bg-card border border-border rounded-lg hover:border-primary transition-all hover:scale-105 hover:shadow-lg group animate-fade-in"
              >
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-muted rounded-lg group-hover:bg-primary/10 transition-colors">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div className="text-left">
                    <p className="text-sm text-muted-foreground">{link.name}</p>
                    <p className="text-foreground font-medium">{link.value}</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors" />
              </a>
            )
          })}
        </div>

        <Button
          size="lg"
          asChild
          className="hover:scale-105 transition-transform animate-fade-in bg-primary text-primary-foreground hover:bg-primary/90 glow-on-hover"
        >
          <a href="mail to : ammarozair16@gmail.com">
            <Mail className="w-4 h-4 mr-2" />
            Say Hello
          </a>
        </Button>

        <footer className="mt-20 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">Designed & Built by Md Ammar Ozair</p>
          <p className="text-xs text-muted-foreground mt-2">© 2025 All rights reserved</p>
        </footer>
      </div>
    </section>
  )
}
