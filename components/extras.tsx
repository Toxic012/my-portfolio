"use client"

import type React from "react"

import { Download, BookOpen, Heart, Award, Upload, Trash2, Plus, Pencil, X, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAdmin } from "@/lib/admin-context"
import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const hobbies = [
  { name: "Reading Tech Blogs", icon: BookOpen },
  { name: "Exploring AI Trends", icon: Award },
  { name: "Entrepreneurship Ideas", icon: Heart },
]

const defaultCertifications = [
  {
    title: "Machine Learning Specialization",
    issuer: "Coursera",
    year: "2023",
    image: "",
    website: "",
  },
  {
    title: "Web Development Bootcamp",
    issuer: "Udemy",
    year: "2022",
    image: "",
    website: "",
  },
  {
    title: "Python for Data Science",
    issuer: "DataCamp",
    year: "2023",
    image: "",
    website: "",
  },
]

type Certification = {
  title: string
  issuer: string
  year: string
  image: string
  website: string
}

export function Extras() {
  const { isEditMode } = useAdmin()
  const [resumeUrl, setResumeUrl] = useState<string | null>(null)
  const [resumeName, setResumeName] = useState<string>("")

  const [certifications, setCertifications] = useState<Certification[]>(defaultCertifications)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [formData, setFormData] = useState<Certification>({
    title: "",
    issuer: "",
    year: "",
    image: "",
    website: "",
  })
  const [imagePreview, setImagePreview] = useState<string>("")
  const [lightboxImage, setLightboxImage] = useState<string | null>(null)

  useEffect(() => {
    const savedResume = localStorage.getItem("resume-url")
    const savedName = localStorage.getItem("resume-name")
    if (savedResume) setResumeUrl(savedResume)
    if (savedName) setResumeName(savedName)

    const savedCertifications = localStorage.getItem("certifications")
    if (savedCertifications) {
      setCertifications(JSON.parse(savedCertifications))
    }
  }, [])

  const handleAddCertification = () => {
    setEditingIndex(null)
    setFormData({ title: "", issuer: "", year: "", image: "", website: "" })
    setImagePreview("")
    setIsDialogOpen(true)
  }

  const handleEditCertification = (index: number) => {
    setEditingIndex(index)
    setFormData(certifications[index])
    setImagePreview(certifications[index].image)
    setIsDialogOpen(true)
  }

  const handleDeleteCertification = (index: number) => {
    const updated = certifications.filter((_, i) => i !== index)
    setCertifications(updated)
    localStorage.setItem("certifications", JSON.stringify(updated))
  }

  const handleSaveCertification = () => {
    if (!formData.title || !formData.issuer || !formData.year) return

    let updated: Certification[]
    if (editingIndex !== null) {
      updated = certifications.map((cert, i) => (i === editingIndex ? formData : cert))
    } else {
      updated = [...certifications, formData]
    }

    setCertifications(updated)
    localStorage.setItem("certifications", JSON.stringify(updated))
    setIsDialogOpen(false)
    setFormData({ title: "", issuer: "", year: "", image: "", website: "" })
    setImagePreview("")
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
    <section id="extras" className="min-h-screen flex items-center px-6 md:px-12 lg:px-20 py-20">
      <div className="max-w-6xl w-full">
        <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2 animate-slide-up">More About Me</h2>
        <div className="h-1 w-20 bg-primary mb-12 animate-slide-up"></div>

        <div className="grid md:grid-cols-2 gap-12">
          <div className="bg-card border border-border rounded-lg p-8 text-center hover:border-primary transition-all hover:scale-105 hover:shadow-xl animate-fade-in">
            <div className="inline-flex p-4 bg-muted rounded-full mb-4">
              <Download className="w-8 h-8 text-primary animate-bounce-slow" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Download Resume</h3>
            <p className="text-muted-foreground mb-6">
              Get a copy of my resume to learn more about my experience and skills.
            </p>

            {resumeUrl ? (
              <div className="space-y-3">
                <Button
                  onClick={handleResumeDownload}
                  className="w-full hover:scale-105 transition-transform bg-primary text-primary-foreground hover:bg-primary/90 glow-on-hover"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download CV
                </Button>

                {isEditMode && (
                  <div className="flex gap-2">
                    <label className="flex-1 cursor-pointer">
                      <Button
                        type="button"
                        variant="outline"
                        className="w-full border-primary text-primary hover:bg-primary/10 bg-transparent"
                        onClick={() => document.getElementById("extras-resume-update")?.click()}
                      >
                        <Upload className="w-4 h-4 mr-2" />
                        Update
                      </Button>
                      <input
                        id="extras-resume-update"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleResumeUpload}
                        className="hidden"
                      />
                    </label>

                    <Button
                      onClick={handleResumeDelete}
                      variant="outline"
                      className="flex-1 border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                )}

                {resumeName && <p className="text-xs text-muted-foreground">{resumeName}</p>}
              </div>
            ) : (
              <div>
                {isEditMode ? (
                  <label className="cursor-pointer">
                    <Button
                      type="button"
                      className="w-full hover:scale-105 transition-transform bg-primary text-primary-foreground hover:bg-primary/90 glow-on-hover"
                      onClick={() => document.getElementById("extras-resume-upload")?.click()}
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      Upload Resume
                    </Button>
                    <input
                      id="extras-resume-upload"
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleResumeUpload}
                      className="hidden"
                    />
                  </label>
                ) : (
                  <Button
                    disabled
                    className="w-full hover:scale-105 transition-transform bg-primary text-primary-foreground hover:bg-primary/90 glow-on-hover opacity-50 cursor-not-allowed"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    No Resume Available
                  </Button>
                )}
              </div>
            )}
          </div>

          {/* Hobbies & Interests */}
          <div className="bg-card border border-border rounded-lg p-8 hover:border-primary transition-all hover:shadow-lg animate-fade-in">
            <h3 className="text-xl font-bold text-foreground mb-6">Hobbies & Interests</h3>
            <div className="space-y-4">
              {hobbies.map((hobby) => {
                const Icon = hobby.icon
                return (
                  <div key={hobby.name} className="flex items-center gap-3 hover:translate-x-2 transition-transform">
                    <div className="p-2 bg-muted rounded-lg">
                      <Icon className="w-5 h-5 text-primary" />
                    </div>
                    <span className="text-foreground">{hobby.name}</span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-foreground">Certifications & Awards</h3>
            {isEditMode && (
              <Button
                onClick={handleAddCertification}
                size="sm"
                className="bg-primary text-primary-foreground hover:bg-primary/90 glow-on-hover"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Certification
              </Button>
            )}
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {certifications.map((cert, index) => (
              <div
                key={index}
                className="bg-card border border-border rounded-lg p-6 hover:border-primary transition-all hover:scale-105 hover:shadow-lg relative group"
              >
                {cert.image && (
                  <div
                    className="mb-4 rounded-lg overflow-hidden cursor-pointer"
                    onClick={() => setLightboxImage(cert.image)}
                  >
                    <img
                      src={cert.image || "/placeholder.svg"}
                      alt={cert.title}
                      className="w-full h-40 object-cover hover:scale-105 transition-transform"
                      onError={(e) => {
                        e.currentTarget.style.display = "none"
                      }}
                    />
                  </div>
                )}
                <div className="flex items-start gap-3 mb-3">
                  <Award className="w-5 h-5 text-primary flex-shrink-0 mt-1" />
                  <h4 className="text-foreground font-semibold leading-tight">{cert.title}</h4>
                </div>
                <p className="text-sm text-muted-foreground mb-1">{cert.issuer}</p>
                <p className="text-xs text-muted-foreground mb-2">{cert.year}</p>

                {cert.website && (
                  <a
                    href={cert.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                  >
                    <ExternalLink className="w-3 h-3" />
                    View Certificate
                  </a>
                )}

                {isEditMode && (
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 bg-background/80 hover:bg-primary/20"
                      onClick={() => handleEditCertification(index)}
                    >
                      <Pencil className="w-3 h-3 text-primary" />
                    </Button>
                    <Button
                      size="icon"
                      variant="ghost"
                      className="h-7 w-7 bg-background/80 hover:bg-destructive/20"
                      onClick={() => handleDeleteCertification(index)}
                    >
                      <Trash2 className="w-3 h-3 text-destructive" />
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-foreground">
                {editingIndex !== null ? "Edit Certification" : "Add Certification"}
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                {editingIndex !== null
                  ? "Update the certification details below."
                  : "Fill in the details for the new certification."}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="cert-title" className="text-foreground">
                  Title
                </Label>
                <Input
                  id="cert-title"
                  placeholder="e.g., Machine Learning Specialization"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cert-issuer" className="text-foreground">
                  Issuer
                </Label>
                <Input
                  id="cert-issuer"
                  placeholder="e.g., Coursera"
                  value={formData.issuer}
                  onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                  className="bg-background border-border text-foreground"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cert-year" className="text-foreground">
                  Year
                </Label>
                <Input
                  id="cert-year"
                  placeholder="e.g., 2023"
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cert-website" className="text-foreground">
                  Certificate URL (optional)
                </Label>
                <Input
                  id="cert-website"
                  type="url"
                  placeholder="https://example.com/certificate"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="bg-background border-border text-foreground"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cert-image" className="text-foreground">
                  Certificate Image
                </Label>
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview || "/placeholder.svg"}
                      alt="Certificate preview"
                      className="w-full h-48 object-cover rounded-lg border border-border"
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ) : (
                  <label
                    htmlFor="cert-image"
                    className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary transition-colors bg-muted/50"
                  >
                    <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                    <p className="text-sm text-muted-foreground">Click to upload certificate image</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG, JPEG (max 5MB)</p>
                    <input
                      id="cert-image"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsDialogOpen(false)}
                className="border-border text-foreground hover:bg-muted"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveCertification}
                className="bg-primary text-primary-foreground hover:bg-primary/90 glow-on-hover"
              >
                {editingIndex !== null ? "Update" : "Add"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Dialog open={!!lightboxImage} onOpenChange={() => setLightboxImage(null)}>
          <DialogContent className="max-w-5xl p-0 bg-transparent border-none">
            <div className="relative">
              <img
                src={lightboxImage || "/placeholder.svg"}
                alt="Certificate preview"
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
