"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { ExternalLink, Github, Plus, Edit2, Trash2, Upload, X } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"

interface Project {
  id: string
  title: string
  description: string
  technologies: string[]
  github: string
  demo: string
  image: string
}

const defaultProjects: Project[] = [
  {
    id: "1",
    title: "Student Performance Prediction",
    description:
      "A machine learning project that predicts student performance based on various factors. Uses Python and scikit-learn to analyze educational data and provide insights.",
    technologies: ["Python", "Machine Learning", "scikit-learn", "Pandas"],
    github: "#",
    demo: "#",
    image: "/machine-learning-dashboard.png",
  },
  {
    id: "2",
    title: "React Shopping Cart",
    description:
      "A fully functional e-commerce shopping cart application built with React. Features include product listing, cart management, and checkout flow.",
    technologies: ["React", "JavaScript", "CSS", "HTML"],
    github: "#",
    demo: "#",
    image: "/shopping-cart-interface.jpg",
  },
  {
    id: "3",
    title: "Portfolio Website",
    description:
      "A modern, responsive portfolio website showcasing projects and skills. Built with Next.js and features dark/light mode toggle.",
    technologies: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
    github: "#",
    demo: "#",
    image: "/portfolio-website-design.png",
  },
]

export function Projects() {
  const { isEditMode } = useAdmin()
  const [projects, setProjects] = useState<Project[]>(defaultProjects)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    technologies: "",
    github: "",
    demo: "",
    image: "",
  })

  useEffect(() => {
    const savedProjects = localStorage.getItem("portfolio_projects")
    if (savedProjects) {
      setProjects(JSON.parse(savedProjects))
    }
  }, [])

  const saveProjects = (updatedProjects: Project[]) => {
    setProjects(updatedProjects)
    localStorage.setItem("portfolio_projects", JSON.stringify(updatedProjects))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const technologiesArray = formData.technologies
      .split(",")
      .map((tech) => tech.trim())
      .filter(Boolean)

    if (editingProject) {
      // Update existing project
      const updatedProjects = projects.map((p) =>
        p.id === editingProject.id ? { ...editingProject, ...formData, technologies: technologiesArray } : p,
      )
      saveProjects(updatedProjects)
    } else {
      // Add new project
      const newProject: Project = {
        id: Date.now().toString(),
        ...formData,
        technologies: technologiesArray,
      }
      saveProjects([...projects, newProject])
    }

    resetForm()
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this project?")) {
      const updatedProjects = projects.filter((p) => p.id !== id)
      saveProjects(updatedProjects)
    }
  }

  const handleEdit = (project: Project) => {
    setEditingProject(project)
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(", "),
      github: project.github,
      demo: project.demo,
      image: project.image,
    })
    setImagePreview(project.image)
    setIsDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      technologies: "",
      github: "",
      demo: "",
      image: "",
    })
    setEditingProject(null)
    setImagePreview("")
    setIsDialogOpen(false)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please upload an image file")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB")
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setFormData({ ...formData, image: base64String })
        setImagePreview(base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemoveImage = () => {
    setFormData({ ...formData, image: "" })
    setImagePreview("")
  }

  return (
    <section id="projects" className="min-h-screen flex items-center px-6 md:px-12 lg:px-20 py-20">
      <div className="max-w-6xl w-full">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground animate-slide-up">Featured Projects</h2>
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
                  Add Project
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>{editingProject ? "Edit Project" : "Add New Project"}</DialogTitle>
                  <DialogDescription>
                    {editingProject ? "Update the project details below." : "Fill in the details for your new project."}
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="title">Project Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      required
                      rows={4}
                    />
                  </div>
                  <div>
                    <Label htmlFor="technologies">Technologies (comma-separated)</Label>
                    <Input
                      id="technologies"
                      value={formData.technologies}
                      onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                      placeholder="React, TypeScript, Next.js"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="github">GitHub URL</Label>
                    <Input
                      id="github"
                      type="url"
                      value={formData.github}
                      onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                      placeholder="https://github.com/username/repo"
                    />
                  </div>
                  <div>
                    <Label htmlFor="demo">Demo URL</Label>
                    <Input
                      id="demo"
                      type="url"
                      value={formData.demo}
                      onChange={(e) => setFormData({ ...formData, demo: e.target.value })}
                      placeholder="https://demo.example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="image">Project Image</Label>
                    <div className="space-y-4">
                      {imagePreview ? (
                        <div className="relative">
                          <img
                            src={imagePreview || "/placeholder.svg"}
                            alt="Preview"
                            className="w-full h-48 object-cover rounded-lg border border-border"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            className="absolute top-2 right-2"
                            onClick={handleRemoveImage}
                          >
                            <X className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary transition-colors">
                          <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                          <Label
                            htmlFor="image-upload"
                            className="cursor-pointer text-primary hover:text-primary/80 font-medium"
                          >
                            Click to upload project image
                          </Label>
                          <p className="text-sm text-muted-foreground mt-2">PNG, JPG, GIF up to 5MB</p>
                          <Input
                            id="image-upload"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 justify-end">
                    <Button type="button" variant="outline" onClick={resetForm}>
                      Cancel
                    </Button>
                    <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                      {editingProject ? "Update" : "Add"} Project
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
        <div className="h-1 w-20 bg-primary mb-12 animate-slide-up"></div>

        <div className="space-y-24">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className={`grid md:grid-cols-2 gap-8 items-center animate-fade-in ${index % 2 === 1 ? "md:grid-flow-dense" : ""}`}
            >
              <div className={index % 2 === 1 ? "md:col-start-2" : ""}>
                <div
                  className="relative group overflow-hidden rounded-lg cursor-pointer"
                  onClick={() => setLightboxImage(project.image)}
                >
                  <div className="absolute inset-0 bg-primary opacity-20 group-hover:opacity-0 transition-opacity duration-300"></div>
                  <img
                    src={project.image || "/placeholder.svg?height=400&width=600"}
                    alt={project.title}
                    className="rounded-lg w-full h-auto transform group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=400&width=600"
                    }}
                  />
                </div>
              </div>

              <div className={index % 2 === 1 ? "md:col-start-1 md:row-start-1" : ""}>
                <p className="text-primary font-mono text-sm mb-2">Featured Project</p>
                <h3 className="text-2xl font-bold text-foreground mb-4">{project.title}</h3>
                <div className="bg-card p-6 rounded-lg border border-border mb-4 hover:border-primary transition-colors">
                  <p className="text-foreground leading-relaxed">{project.description}</p>
                </div>
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="text-xs font-mono text-secondary bg-muted px-3 py-1 rounded-full">
                      {tech}
                    </span>
                  ))}
                </div>
                <div className="flex gap-4 flex-wrap">
                  <Button
                    variant="outline"
                    size="sm"
                    asChild
                    className="hover:scale-105 transition-transform bg-transparent border-primary text-primary glow-on-hover"
                  >
                    <a href={project.github} target="_blank" rel="noopener noreferrer">
                      <Github className="w-4 h-4 mr-2" />
                      Code
                    </a>
                  </Button>
                  <Button
                    size="sm"
                    asChild
                    className="hover:scale-105 transition-transform bg-primary text-primary-foreground hover:bg-primary/90 glow-on-hover"
                  >
                    <a href={project.demo} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Live Demo
                    </a>
                  </Button>
                  {isEditMode && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(project)}
                        className="border-blue-500 text-blue-500 hover:bg-blue-500/10"
                      >
                        <Edit2 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(project.id)}
                        className="border-orange-500 text-orange-500 hover:bg-orange-500/10"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <Dialog open={!!lightboxImage} onOpenChange={() => setLightboxImage(null)}>
          <DialogContent className="max-w-5xl p-0 bg-transparent border-none">
            <div className="relative">
              <img
                src={lightboxImage || "/placeholder.svg"}
                alt="Project preview"
                className="w-full h-auto rounded-lg"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 bg-background/80 hover:bg-background"
                onClick={() => setLightboxImage(null)}
              >
                <X className="w-6 h-6" />
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  )
}
