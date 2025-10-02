"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { GraduationCap, Award, Plus, Edit2, Trash2 } from "lucide-react"
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

interface Education {
  id: string
  degree: string
  institute: string
  duration: string
  highlights: string[]
}

const defaultEducation: Education[] = [
  {
    id: "1",
    degree: "Bachelor of Technology in Computer Science",
    institute: "Your University Name",
    duration: "2021 - 2025",
    highlights: [
      "CGPA: 8.5/10",
      "Relevant Coursework: Data Structures, Algorithms, Machine Learning, Web Development",
      "Member of Computer Science Society",
      "Participated in multiple hackathons and coding competitions",
    ],
  },
  {
    id: "2",
    degree: "Higher Secondary Education",
    institute: "Your School Name",
    duration: "2019 - 2021",
    highlights: [
      "Percentage: 85%",
      "Science Stream (PCM with Computer Science)",
      "School Topper in Computer Science",
      "Led the school coding club",
    ],
  },
]

export function Education() {
  const { isEditMode } = useAdmin()
  const [education, setEducation] = useState<Education[]>(defaultEducation)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingEducation, setEditingEducation] = useState<Education | null>(null)
  const [formData, setFormData] = useState({
    degree: "",
    institute: "",
    duration: "",
    highlights: "",
  })

  useEffect(() => {
    const savedEducation = localStorage.getItem("portfolio_education")
    if (savedEducation) {
      setEducation(JSON.parse(savedEducation))
    }
  }, [])

  const saveEducation = (updatedEducation: Education[]) => {
    setEducation(updatedEducation)
    localStorage.setItem("portfolio_education", JSON.stringify(updatedEducation))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const highlightsArray = formData.highlights
      .split("\n")
      .map((h) => h.trim())
      .filter(Boolean)

    if (editingEducation) {
      const updatedEducation = education.map((edu) =>
        edu.id === editingEducation.id ? { ...editingEducation, ...formData, highlights: highlightsArray } : edu,
      )
      saveEducation(updatedEducation)
    } else {
      const newEducation: Education = {
        id: Date.now().toString(),
        ...formData,
        highlights: highlightsArray,
      }
      saveEducation([...education, newEducation])
    }

    resetForm()
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this education entry?")) {
      const updatedEducation = education.filter((edu) => edu.id !== id)
      saveEducation(updatedEducation)
    }
  }

  const handleEdit = (edu: Education) => {
    setEditingEducation(edu)
    setFormData({
      degree: edu.degree,
      institute: edu.institute,
      duration: edu.duration,
      highlights: edu.highlights.join("\n"),
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      degree: "",
      institute: "",
      duration: "",
      highlights: "",
    })
    setEditingEducation(null)
    setIsDialogOpen(false)
  }

  return (
    <section id="education" className="min-h-screen flex items-center px-6 md:px-12 lg:px-20 py-20">
      <div className="max-w-4xl w-full">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">Education</h2>
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
                  Add Education
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingEducation ? "Edit Education" : "Add New Education"}</DialogTitle>
                  <DialogDescription>
                    {editingEducation ? "Update the education details." : "Add a new education entry."}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="degree">Degree/Qualification</Label>
                    <Input
                      id="degree"
                      value={formData.degree}
                      onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="institute">Institute/School</Label>
                    <Input
                      id="institute"
                      value={formData.institute}
                      onChange={(e) => setFormData({ ...formData, institute: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="duration">Duration</Label>
                    <Input
                      id="duration"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="2021 - 2025"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="highlights">Highlights (one per line)</Label>
                    <Textarea
                      id="highlights"
                      value={formData.highlights}
                      onChange={(e) => setFormData({ ...formData, highlights: e.target.value })}
                      rows={6}
                      placeholder="CGPA: 8.5/10&#10;Relevant Coursework: Data Structures, Algorithms&#10;Member of Computer Science Society"
                      required
                    />
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-primary text-primary-foreground">
                      {editingEducation ? "Update" : "Add"} Education
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <div className="h-1 w-20 bg-primary mb-12"></div>

        <div className="space-y-8">
          {education.map((edu, index) => (
            <div
              key={edu.id}
              className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-colors"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-3 bg-muted rounded-lg">
                  <GraduationCap className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-xl font-bold text-foreground mb-1">{edu.degree}</h3>
                      <p className="text-primary font-medium mb-1">{edu.institute}</p>
                      <p className="text-sm text-secondary">{edu.duration}</p>
                    </div>
                    {isEditMode && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEdit(edu)}
                          className="border-blue-500 text-blue-500 hover:bg-blue-500/10"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDelete(edu.id)}
                          className="border-orange-500 text-orange-500 hover:bg-orange-500/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="pl-16">
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-4 h-4 text-primary" />
                  <h4 className="text-sm font-semibold text-foreground">Highlights</h4>
                </div>
                <ul className="space-y-2">
                  {edu.highlights.map((highlight, idx) => (
                    <li key={idx} className="text-secondary flex items-start gap-2 text-sm">
                      <span className="text-primary mt-1">▹</span>
                      <span>{highlight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
