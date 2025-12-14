"use client"

import type React from "react"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"

export function AccountSecurityTab() {
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [error, setError] = useState("")

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData((prev) => ({ ...prev, [name]: value }))
  }

  const handleUpdatePassword = () => {
    setError("")

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setError("Please fill in all password fields")
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError("New passwords do not match")
      return
    }

    if (passwordData.newPassword.length < 8) {
      setError("New password must be at least 8 characters")
      return
    }

    // Simulate password update
    setShowPasswordForm(false)
    setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
  }

  return (
    <div className="space-y-6">
      <Card className="bg-card border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Password Management</h3>
        {!showPasswordForm ? (
          <Button
            onClick={() => setShowPasswordForm(true)}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            Change Password
          </Button>
        ) : (
          <div className="space-y-4">
            {error && (
              <div className="flex gap-2 rounded-lg bg-destructive/10 p-3 text-destructive">
                <AlertCircle className="h-5 w-5 flex-shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <div>
              <Label htmlFor="currentPassword" className="text-foreground">
                Current Password
              </Label>
              <Input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                className="mt-2 bg-background border-border text-foreground"
              />
            </div>

            <div>
              <Label htmlFor="newPassword" className="text-foreground">
                New Password
              </Label>
              <Input
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                className="mt-2 bg-background border-border text-foreground"
              />
            </div>

            <div>
              <Label htmlFor="confirmPassword" className="text-foreground">
                Confirm New Password
              </Label>
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                className="mt-2 bg-background border-border text-foreground"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleUpdatePassword} className="bg-primary text-primary-foreground hover:bg-primary/90">
                Update Password
              </Button>
              <Button
                onClick={() => {
                  setShowPasswordForm(false)
                  setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" })
                  setError("")
                }}
                variant="outline"
                className="border-border text-foreground hover:bg-muted bg-transparent"
              >
                Cancel
              </Button>
            </div>
          </div>
        )}
      </Card>

      <Card className="bg-card border-border p-6">
        <h3 className="font-semibold text-foreground mb-4">Active Sessions</h3>
        <div className="space-y-3">
          {[
            { device: "Chrome on Windows", location: "New York, USA", time: "Active now" },
            { device: "Safari on iPhone", location: "New York, USA", time: "2 hours ago" },
          ].map((session, i) => (
            <div key={i} className="flex items-center justify-between pb-3 border-b border-border last:border-0">
              <div>
                <p className="font-medium text-foreground">{session.device}</p>
                <p className="text-sm text-muted-foreground">
                  {session.location} • {session.time}
                </p>
              </div>
              <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10">
                Sign Out
              </Button>
            </div>
          ))}
        </div>
      </Card>

      <Card className="bg-card border-border p-6 border-destructive/50 bg-destructive/5">
        <h3 className="font-semibold text-destructive mb-4">Danger Zone</h3>
        <p className="text-sm text-destructive/80 mb-4">
          Deleting your account is permanent and cannot be undone. All your data will be lost.
        </p>
        <Button className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete Account</Button>
      </Card>
    </div>
  )
}
