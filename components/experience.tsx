"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Briefcase, Calendar, Plus, Edit2, Trash2 } from "lucide-react"
import { useAdmin } from "@/lib/admin-context"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface Experience {
  id: string
  company: string
  role: string
  duration: string
  responsibilities: string[]
}

const defaultExperiences: Experience[] = [
  {
    id: "1",
    company: "Freelance",
    role: "Web Developer",
    duration: "2023 - Present",
    responsibilities: [
      "Developed responsive websites for small businesses and startups",
      "Implemented modern web technologies including React and Next.js",
      "Collaborated with clients to understand requirements and deliver solutions",
      "Maintained and updated existing web applications",
    ],
  },
  {
    id: "2",
    company: "Academic Projects",
    role: "Student Developer",
    duration: "2022 - Present",
    responsibilities: [
      "Built machine learning models for student performance prediction",
      "Created interactive web applications using React",
      "Participated in coding competitions and hackathons",
      "Collaborated with peers on group projects",
    ],
  },
]

export function Experience() {
  const { isEditMode } = useAdmin()
  const [experiences, setExperiences] = useState<Experience[]>(defaultExperiences)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingExperience, setEditingExperience] = useState<Experience | null>(null)
  const [formData, setFormData] = useState({
    company: "",
    role: "",
    duration: "",
    responsibilities: "",
  })

  useEffect(() => {
    const savedExperiences = localStorage.getItem("portfolio_experiences")
    if (savedExperiences) {
      setExperiences(JSON.parse(savedExperiences))
    }
  }, [])

  const saveExperiences = (updatedExperiences: Experience[]) => {
    setExperiences(updatedExperiences)
    localStorage.setItem("portfolio_experiences", JSON.stringify(updatedExperiences))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const responsibilitiesArray = formData.responsibilities
      .split("\n")
      .map((r) => r.trim())
      .filter(Boolean)

    if (editingExperience) {
      const updatedExperiences = experiences.map((exp) =>
        exp.id === editingExperience.id
          ? { ...editingExperience, ...formData, responsibilities: responsibilitiesArray }
          : exp,
      )
      saveExperiences(updatedExperiences)
    } else {
      const newExperience: Experience = {
        id: Date.now().toString(),
        ...formData,
        responsibilities: responsibilitiesArray,
      }
      saveExperiences([...experiences, newExperience])
    }

    resetForm()
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this experience?")) {
      const updatedExperiences = experiences.filter((exp) => exp.id !== id)
      saveExperiences(updatedExperiences)
    }
  }

  const handleEdit = (experience: Experience) => {
    setEditingExperience(experience)
    setFormData({
      company: experience.company,
      role: experience.role,
      duration: experience.duration,
      responsibilities: experience.responsibilities.join("\n"),
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      company: "",
      role: "",
      duration: "",
      responsibilities: "",
    })
    setEditingExperience(null)
    setIsDialogOpen(false)
  }

  return (
    <section id="experience" className="min-h-screen flex items-center px-6 md:px-12 lg:px-20 py-20">
      <div className="max-w-4xl w-full">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground animate-slide-up">Experience</h2>
          {isEditMode && (
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  className="bg-primary text-primary-foreground hover:bg-primary/90 glow-on-hover"
                  onClick={() => {
                    resetForm()
                    setIsDialogOpen(true)
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Experience
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingExperience ? "Edit Experience" : "Add New Experience"}</DialogTitle>
                  <DialogDescription>
                    {editingExperience ? "Update the experience details." : "Add a new work experience."}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="role">Role/Position</Label>
                    <Input
                      id="role"
                      value={formData.role}
                      onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="company">Company/Organization</Label>
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="2023 - Present"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="responsibilities">Responsibilities (one per line)</Label>
                    <Textarea
                      id="responsibilities"
                      value={formData.responsibilities}
                      onChange={(e) => setFormData({ ...formData, responsibilities: e.target.value })}
                      rows={6}
                      placeholder="Developed responsive websites&#10;Implemented modern web technologies&#10;Collaborated with clients"
                      required
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-primary text-primary-foreground">
                      {editingExperience ? "Update" : "Add"} Experience
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <div className="h-1 w-20 bg-primary mb-12 animate-slide-up"></div>

        <div className="space-y-12">
          {experiences.map((exp, index) => (
            <div key={exp.id} className="relative pl-8 border-l-2 border-muted animate-fade-in">
              <div className="absolute -left-2 top-0 w-4 h-4 rounded-full bg-primary animate-pulse-glow"></div>

              <div className="mb-4">
                <div className="flex items-start justify-between flex-wrap gap-2 mb-2">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{exp.role}</h3>
                    <div className="flex items-center gap-2 text-primary">
                      <Briefcase className="w-4 h-4" />
                      <span>{exp.company}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-2 text-muted-foreground text-sm">
                      <Calendar className="w-4 h-4" />
                      <span>{exp.duration}</span>
                    </div>
                    {isEditMode && (
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(exp)}
                          className="h-7 px-2 border-blue-500 text-blue-500"
                        >
                          <Edit2 className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(exp.id)}
                          className="h-7 px-2 border-orange-500 text-orange-500"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <ul className="space-y-2">
                {exp.responsibilities.map((resp, idx) => (
                  <li
                    key={idx}
                    className="text-muted-foreground flex items-start gap-2 hover:text-foreground transition-colors"
                  >
                    <span className="text-primary mt-1.5">▹</span>
                    <span>{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
