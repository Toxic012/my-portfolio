"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

const navItems = [
  { name: "About", href: "#about" },
  { name: "Skills", href: "#skills" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Education", href: "#education" },
  { name: "Extras", href: "#extras" },
  { name: "Contact", href: "#contact" },
]

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("about")

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => item.href.slice(1))
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <>
      {/* Desktop Sidebar */}
      <header className="hidden lg:flex fixed left-0 top-0 h-screen w-64 flex-col justify-between border-r border-border bg-background p-8 z-50">
        <div>
          <div className="mb-12">
            <div className="w-24 h-24 rounded-full bg-muted mb-4 overflow-hidden border-2 border-primary">
              <img src="/professional-headshot.png" alt="Md Ammar Ozair" className="w-full h-full object-cover" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-1">Md Ammar Ozair</h1>
            <p className="text-sm text-primary">Software Developer</p>
            <p className="text-xs text-muted-foreground mt-1">AI Enthusiast</p>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`block py-2 px-3 rounded-md text-sm transition-all duration-300 ${
                  activeSection === item.href.slice(1)
                    ? "text-primary bg-muted border-l-2 border-primary"
                    : "text-muted-foreground hover:text-primary hover:bg-muted hover:translate-x-1"
                }`}
              >
                {item.name}
              </a>
            ))}
          </nav>
        </div>
      </header>

      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-background border-b border-border z-50">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-lg font-bold text-foreground">Md Ammar Ozair</h1>
            <p className="text-xs text-primary">Software Developer</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <nav className="border-t border-border bg-background p-4">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block py-2 px-3 rounded-md text-sm transition-colors ${
                  activeSection === item.href.slice(1)
                    ? "text-primary bg-muted"
                    : "text-muted-foreground hover:text-primary hover:bg-muted"
                }`}
              >
                {item.name}
              </a>
            ))}
          </nav>
        )}
      </header>
    </>
  )
}
