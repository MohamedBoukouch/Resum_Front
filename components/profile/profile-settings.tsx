"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle } from "lucide-react"
import { ProfileHeader } from "./profile-header"
import { AccountSecurityTab } from "./account-security-tab"

type Tab = "profile" | "security" | "preferences"

export function ProfileSettings() {
  const [activeTab, setActiveTab] = useState<Tab>("profile")
  const [userData, setUserData] = useState<Record<string, string>>({
    name: "",
    email: "",
    phone: "",
    bio: "",
  })
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState("")

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      const parsedUser = JSON.parse(user)
      setUserData((prev) => ({
        ...prev,
        name: parsedUser.name || "",
        email: parsedUser.email || "",
      }))
    }
  }, [])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setUserData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      const user = localStorage.getItem("user")
      if (user) {
        const parsedUser = JSON.parse(user)
        localStorage.setItem("user", JSON.stringify({ ...parsedUser, ...userData }))
      }
      setSaveMessage("Profile updated successfully!")
      setIsEditing(false)
      setTimeout(() => setSaveMessage(""), 3000)
    } catch (error) {
      setSaveMessage("Error saving profile. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }

  const tabs: Array<{ id: Tab; label: string }> = [
    { id: "profile", label: "Profile Information" },
    { id: "security", label: "Account Security" },
    { id: "preferences", label: "Preferences" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Account Settings</h1>
        <p className="text-muted-foreground">Manage your profile, security, and preferences</p>
      </div>

      <ProfileHeader name={userData.name} email={userData.email} />

      <div className="border-b border-border">
        <div className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-4 px-1 border-b-2 font-medium transition-colors ${
                activeTab === tab.id
                  ? "border-primary text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "profile" && (
        <Card className="bg-card border-border p-6">
          <div className="space-y-6">
            {saveMessage && (
              <div
                className={`flex gap-2 rounded-lg p-3 ${
                  saveMessage.includes("Error")
                    ? "bg-destructive/10 text-destructive"
                    : "bg-green-500/10 text-green-700 dark:text-green-400"
                }`}
              >
                {saveMessage.includes("Error") ? (
                  <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                ) : (
                  <CheckCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                )}
                <p className="text-sm">{saveMessage}</p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="name" className="text-foreground">
                  Full Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  value={userData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-2 bg-background border-border text-foreground placeholder:text-muted-foreground disabled:opacity-50"
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-foreground">
                  Email Address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={userData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="mt-2 bg-background border-border text-foreground placeholder:text-muted-foreground disabled:opacity-50"
                />
              </div>

              <div>
                <Label htmlFor="phone" className="text-foreground">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={userData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  placeholder="+1 (555) 000-0000"
                  className="mt-2 bg-background border-border text-foreground placeholder:text-muted-foreground disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="bio" className="text-foreground">
                Bio
              </Label>
              <textarea
                id="bio"
                name="bio"
                value={userData.bio}
                onChange={handleInputChange}
                disabled={!isEditing}
                placeholder="Tell us about yourself..."
                rows={4}
                className="mt-2 w-full p-3 rounded-lg bg-background border border-border text-foreground placeholder:text-muted-foreground resize-none disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex gap-2 pt-4">
              {!isEditing ? (
                <Button
                  onClick={() => setIsEditing(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Edit Profile
                </Button>
              ) : (
                <>
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                  <Button
                    onClick={() => setIsEditing(false)}
                    variant="outline"
                    className="border-border text-foreground hover:bg-muted bg-transparent"
                  >
                    Cancel
                  </Button>
                </>
              )}
            </div>
          </div>
        </Card>
      )}

      {activeTab === "security" && <AccountSecurityTab />}

      {activeTab === "preferences" && (
        <Card className="bg-card border-border p-6">
          <div className="space-y-6">
            <div>
              <h3 className="font-semibold text-foreground mb-4">Notification Settings</h3>
              <div className="space-y-3">
                {[
                  { label: "Email notifications", checked: true },
                  { label: "Summary ready alerts", checked: true },
                  { label: "Weekly digest", checked: false },
                  { label: "Marketing emails", checked: false },
                ].map((pref, i) => (
                  <label key={i} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={pref.checked}
                      className="w-4 h-4 rounded border-border cursor-pointer"
                    />
                    <span className="text-foreground">{pref.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="border-t border-border pt-6">
              <h3 className="font-semibold text-foreground mb-4">Privacy Settings</h3>
              <div className="space-y-3">
                {[
                  { label: "Make profile publicly visible", checked: false },
                  { label: "Allow sharing of summaries", checked: true },
                  { label: "Allow usage analytics", checked: true },
                ].map((pref, i) => (
                  <label key={i} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      defaultChecked={pref.checked}
                      className="w-4 h-4 rounded border-border cursor-pointer"
                    />
                    <span className="text-foreground">{pref.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">Save Preferences</Button>
          </div>
        </Card>
      )}
    </div>
  )
}
