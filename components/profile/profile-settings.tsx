"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, CheckCircle, Trash2, Key } from "lucide-react"
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { authAPI, userAPI, getUser, removeToken, removeUser } from "@/lib/api"
import { useRouter } from "next/navigation"

export function ProfileSettings() {
  const router = useRouter()
  const [userData, setUserData] = useState({ full_name: "", email: "", username: "" })
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [message, setMessage] = useState<string | null>(null)
  const [isError, setIsError] = useState(false)

  // Password change state
  const [passwordData, setPasswordData] = useState({
    old_password: "",
    new_password: "",
    confirm_password: ""
  })
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showChangePassword, setShowChangePassword] = useState(false)

  // Delete account state
  const [deletePassword, setDeletePassword] = useState("")
  const [isDeleting, setIsDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  useEffect(() => {
    const loadProfile = async () => {
      const user = getUser()
      if (!user) {
        removeToken()
        removeUser()
        return window.location.replace("/login") // redirect if no user
      }

      try {
        // fetch fresh user data from backend
        const me = await authAPI.me()
        setUserData({
          full_name: me.full_name || "",
          email: me.email || "",
          username: me.username || ""
        })
      } catch {
        // token expired or invalid → logout
        removeToken()
        removeUser()
        window.location.replace("/login")
      }
    }

    loadProfile()
  }, [])

  // handle profile input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setUserData(prev => ({ ...prev, [name]: value }))
  }

  // handle password input changes
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setPasswordData(prev => ({ ...prev, [name]: value }))
  }

  // save profile changes
  const handleSave = async () => {
    setIsSaving(true)
    setMessage(null)
    try {
      await userAPI.updateMe(userData)
      setMessage("Profile updated successfully")
      setIsError(false)
      setIsEditing(false)
      // Refresh user data
      const freshUser = await authAPI.me()
      localStorage.setItem("user", JSON.stringify(freshUser))
    } catch {
      setMessage("Error saving profile")
      setIsError(true)
    } finally {
      setIsSaving(false)
    }
  }

  // change password
  const handleChangePassword = async () => {
    if (passwordData.new_password !== passwordData.confirm_password) {
      setMessage("New passwords do not match")
      setIsError(true)
      return
    }

    if (passwordData.new_password.length < 6) {
      setMessage("New password must be at least 6 characters")
      setIsError(true)
      return
    }

    setIsChangingPassword(true)
    setMessage(null)

    try {
      await authAPI.changePassword({
        old_password: passwordData.old_password,
        new_password: passwordData.new_password
      })
      
      setMessage("Password changed successfully")
      setIsError(false)
      setPasswordData({
        old_password: "",
        new_password: "",
        confirm_password: ""
      })
      setShowChangePassword(false)
    } catch (err: any) {
      setMessage(err.message || "Error changing password")
      setIsError(true)
    } finally {
      setIsChangingPassword(false)
    }
  }

  // delete account
  const handleDeleteAccount = async () => {
    if (!deletePassword) {
      setMessage("Please enter your password to confirm account deletion")
      setIsError(true)
      return
    }

    setIsDeleting(true)
    setMessage(null)

    try {
      await authAPI.deleteAccount()
      
      // Clear local storage
      removeToken()
      removeUser()
      
      setMessage("Account deleted successfully. Redirecting to home page...")
      setIsError(false)
      
      // Redirect to home page after delay
      setTimeout(() => {
        router.push("/")
      }, 2000)
    } catch (err: any) {
      setMessage(err.message || "Error deleting account")
      setIsError(true)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-2">Account Settings</h1>

      {message && (
        <div className={`flex gap-2 p-3 rounded-lg ${isError ? "bg-destructive/10 text-destructive" : "bg-green-500/10 text-green-700"}`}>
          {isError ? <AlertCircle className="h-5 w-5" /> : <CheckCircle className="h-5 w-5" />}
          <span>{message}</span>
        </div>
      )}

      {/* Profile Information Card */}
      <Card className="p-6 space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <span>Profile Information</span>
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label>Full Name</Label>
            <Input 
              name="full_name" 
              value={userData.full_name} 
              onChange={handleInputChange} 
              disabled={!isEditing} 
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input 
              name="email" 
              type="email" 
              value={userData.email} 
              onChange={handleInputChange} 
              disabled={!isEditing} 
            />
          </div>
          <div>
            <Label>Username</Label>
            <Input 
              name="username" 
              value={userData.username} 
              onChange={handleInputChange} 
              disabled={!isEditing} 
            />
          </div>
        </div>

        {!isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Edit Profile</Button>
        ) : (
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={isSaving}>
              {isSaving ? "Saving..." : "Save Changes"}
            </Button>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        )}
      </Card>

      {/* Change Password Card */}
      <Card className="p-6 space-y-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Key className="h-5 w-5" />
          <span>Change Password</span>
        </h2>
        
        {!showChangePassword ? (
          <Button variant="outline" onClick={() => setShowChangePassword(true)}>
            Change Password
          </Button>
        ) : (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Current Password</Label>
                <Input
                  type="password"
                  name="old_password"
                  value={passwordData.old_password}
                  onChange={handlePasswordChange}
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <Label>New Password</Label>
                <Input
                  type="password"
                  name="new_password"
                  value={passwordData.new_password}
                  onChange={handlePasswordChange}
                  placeholder="Enter new password"
                />
              </div>
              <div className="md:col-span-2">
                <Label>Confirm New Password</Label>
                <Input
                  type="password"
                  name="confirm_password"
                  value={passwordData.confirm_password}
                  onChange={handlePasswordChange}
                  placeholder="Confirm new password"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleChangePassword} 
                disabled={isChangingPassword}
              >
                {isChangingPassword ? "Changing Password..." : "Update Password"}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowChangePassword(false)
                  setPasswordData({
                    old_password: "",
                    new_password: "",
                    confirm_password: ""
                  })
                }}
              >
                Cancel
              </Button>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Make sure your new password is at least 6 characters long.
            </p>
          </div>
        )}
      </Card>

      {/* Delete Account Card - Dangerous Zone */}
      <Card className="p-6 space-y-6 border-destructive/50 border-2">
        <h2 className="text-xl font-semibold flex items-center gap-2 text-destructive">
          <Trash2 className="h-5 w-5" />
          <span>Delete Account</span>
        </h2>
        
        <div className="space-y-4">
          <p className="text-muted-foreground">
            Once you delete your account, there is no going back. This will permanently remove all your data and cannot be undone.
          </p>
          
          <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
            <AlertDialogTrigger asChild>
              <Button variant="destructive">Delete Account</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete your account
                  and remove all your data from our servers.
                </AlertDialogDescription>
              </AlertDialogHeader>
              
              <div className="space-y-4 py-4">
                <Label htmlFor="deletePassword">Enter your password to confirm:</Label>
                <Input
                  id="deletePassword"
                  type="password"
                  value={deletePassword}
                  onChange={(e) => setDeletePassword(e.target.value)}
                  placeholder="Enter your password"
                />
              </div>
              
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => setDeletePassword("")}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  onClick={handleDeleteAccount}
                  disabled={isDeleting}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  {isDeleting ? "Deleting..." : "Delete Account"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </Card>
    </div>
  )
}