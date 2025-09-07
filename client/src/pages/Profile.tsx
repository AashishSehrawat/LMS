import Header from "@/components/Header";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Edit, Mail } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { RootState } from "../redux/store";

const Profile = () => {
  // Mock user data - in a real app, this would come from a state management solution or API
  const { user } = useSelector((state: RootState) => state.auth)
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-background pb-6">
      <Header />
      <div className="max-w-4xl mx-auto space-y-8 pt-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Profile</h1>
          <Button className="hover:shadow-glow cursor-pointer transition-all duration-300" onClick={() => navigate('/profile/edit')}>
            <Edit className="mr-2 h-4 w-4" />
            Edit Profile
          </Button>
        </div>

        {/* User Info Card */}
        <Card className="border-0 shadow-elegant">
          <CardHeader className="pb-4">
            <div className="flex items-start gap-6">
              <Avatar className="w-24 h-24 border-4 border-primary/10">
                <AvatarImage src={user?.photoUrl} alt={user?.name} />
                <AvatarFallback className="text-2xl font-semibold bg-gradient-to-br from-primary to-primary-glow text-primary-foreground">
                  {user?.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-3">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">{user?.name} <span className="text-muted-foreground font-semibold text-sm">({user?.role})</span></h2>
                  <div className="flex items-center gap-2 text-muted-foreground mt-1">
                    <Mail className="h-4 w-4" />
                    <span>{user?.email}</span>
                  </div>
                </div>

                <p className="text-muted-foreground leading-relaxed max-w-2xl">
                  {user?.description}
                </p>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-0 shadow-elegant">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {user?.enrollCourses.length}
              </div>
              <div className="text-sm text-muted-foreground">Total Courses</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-elegant">
            <CardContent className="p-6 text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {Math.round(Math.random()*100)}%
              </div>
              <div className="text-sm text-muted-foreground">Average Progress</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;