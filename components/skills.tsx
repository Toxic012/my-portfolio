"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Code2, MessageSquare, Users, Lightbulb, ExternalLink, Plus, Edit2, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAdmin } from "@/lib/admin-context"
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

interface TechnicalSkill {
  id: string
  name: string
  level: "Beginner" | "Intermediate" | "Advanced"
}

const defaultTechnicalSkills: TechnicalSkill[] = [
  { id: "1", name: "Java", level: "Intermediate" },
  { id: "2", name: "Python", level: "Intermediate" },
  { id: "3", name: "HTML", level: "Advanced" },
  { id: "4", name: "JavaScript", level: "Intermediate" },
  { id: "5", name: "CSS", level: "Advanced" },
]

const codingPlatforms = [
  {
    name: "LeetCode",
    href: "https://leetcode.com/u/M_Ammar_/",
    color: "text-orange-500",
  },
  {
    name: "CodeChef",
    href: "https://www.codechef.com/users/md_ammar",
    color: "text-amber-600",
  },
  {
    name: "HackerRank",
    href: "https://www.hackerrank.com/profile/ammarozair02",
    color: "text-green-500",
  },
]

const softSkills = [
  { name: "Communication", icon: MessageSquare, description: "English, Hindi, Urdu" },
  { name: "Leadership", icon: Users, description: "Team management & mentoring" },
  { name: "Teamwork", icon: Users, description: "Collaborative problem solving" },
  { name: "Problem Solving", icon: Lightbulb, description: "Analytical thinking" },
]

export function Skills() {
  const { isEditMode } = useAdmin()
  const [technicalSkills, setTechnicalSkills] = useState<TechnicalSkill[]>(defaultTechnicalSkills)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingSkill, setEditingSkill] = useState<TechnicalSkill | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    level: "Intermediate" as "Beginner" | "Intermediate" | "Advanced",
  })

  useEffect(() => {
    const savedSkills = localStorage.getItem("portfolio_technical_skills")
    if (savedSkills) {
      setTechnicalSkills(JSON.parse(savedSkills))
    }
  }, [])

  const saveSkills = (updatedSkills: TechnicalSkill[]) => {
    setTechnicalSkills(updatedSkills)
    localStorage.setItem("portfolio_technical_skills", JSON.stringify(updatedSkills))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (editingSkill) {
      const updatedSkills = technicalSkills.map((s) =>
        s.id === editingSkill.id ? { ...editingSkill, ...formData } : s,
      )
      saveSkills(updatedSkills)
    } else {
      const newSkill: TechnicalSkill = {
        id: Date.now().toString(),
        ...formData,
      }
      saveSkills([...technicalSkills, newSkill])
    }

    resetForm()
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this skill?")) {
      const updatedSkills = technicalSkills.filter((s) => s.id !== id)
      saveSkills(updatedSkills)
    }
  }

  const handleEdit = (skill: TechnicalSkill) => {
    setEditingSkill(skill)
    setFormData({
      name: skill.name,
      level: skill.level,
    })
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      name: "",
      level: "Intermediate",
    })
    setEditingSkill(null)
    setIsDialogOpen(false)
  }

  return (
    <section id="skills" className="min-h-screen flex items-center px-6 md:px-12 lg:px-20 py-20">
      <div className="max-w-6xl w-full">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2 animate-slide-up">Skills & Expertise</h2>
        <div className="h-1 w-20 bg-primary mb-12 animate-slide-up"></div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Technical Skills */}
          <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Code2 className="w-6 h-6 text-primary" />
                <h3 className="text-2xl font-bold text-foreground">Technical Skills</h3>
              </div>
              {isEditMode && (
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      size="sm"
                      variant="outline"
                      className="border-primary text-primary glow-on-hover bg-transparent"
                      onClick={() => {
                        resetForm()
                        setIsDialogOpen(true)
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{editingSkill ? "Edit Skill" : "Add New Skill"}</DialogTitle>
                      <DialogDescription>
                        {editingSkill ? "Update the skill details." : "Add a new technical skill."}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="name">Skill Name</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="level">Skill Level</Label>
                        <select
                          id="level"
                          value={formData.level}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              level: e.target.value as "Beginner" | "Intermediate" | "Advanced",
                            })
                          }
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground"
                          required
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                        </select>
                      </div>
                      <div className="flex gap-2 justify-end">
                        <Button type="button" variant="outline" onClick={resetForm}>
                          Cancel
                        </Button>
                        <Button type="submit" className="bg-primary text-primary-foreground">
                          {editingSkill ? "Update" : "Add"} Skill
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              )}
            </div>
            <div className="space-y-6">
              {technicalSkills.map((skill) => (
                <div key={skill.id}>
                  <div className="flex justify-between mb-2">
                    <span className="text-foreground font-medium">{skill.name}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-primary">{skill.level}</span>
                      {isEditMode && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEdit(skill)}
                            className="h-6 w-6 p-0 text-blue-500"
                          >
                            <Edit2 className="w-3 h-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(skill.id)}
                            className="h-6 w-6 p-0 text-orange-500"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all duration-500 hover:bg-primary/80"
                      style={{
                        width: skill.level === "Advanced" ? "90%" : skill.level === "Intermediate" ? "70%" : "50%",
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 p-4 bg-card border border-border rounded-lg">
              <h4 className="text-sm font-semibold text-foreground mb-3">Coding Platforms</h4>
              <div className="flex flex-wrap gap-2">
                {codingPlatforms.map((platform) => (
                  <Button
                    key={platform.name}
                    variant="outline"
                    size="sm"
                    asChild
                    className="hover:border-primary transition-all hover:scale-105 bg-transparent border-primary glow-on-hover"
                  >
                    <a href={platform.href} target="_blank" rel="noopener noreferrer">
                      <span className={platform.color}>{platform.name}</span>
                      <ExternalLink className="w-3 h-3 ml-2" />
                    </a>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Soft Skills */}
          <div className="animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
              <Users className="w-6 h-6 text-primary" />
              <h3 className="text-2xl font-bold text-foreground">Soft Skills</h3>
            </div>
            <div className="grid gap-4">
              {softSkills.map((skill) => {
                const Icon = skill.icon
                return (
                  <div
                    key={skill.name}
                    className="p-4 bg-card border border-border rounded-lg hover:border-primary transition-all hover:scale-105 hover:shadow-lg"
                  >
                    <div className="flex items-start gap-3">
                      <Icon className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="text-foreground font-semibold mb-1">{skill.name}</h4>
                        <p className="text-sm text-muted-foreground">{skill.description}</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
