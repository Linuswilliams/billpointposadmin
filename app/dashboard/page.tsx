"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import {
  Bell,
  ChevronDown,
  Layout,
  LogOut,
  Menu,
  Settings,
  User,
  X,
  Users,
  ShoppingBag,
  AlertCircle,
  Search,
  ChevronRight,
  Calendar,
  CreditCard,
  ChartScatter,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Switch } from "@/components/ui/switch"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Line,
  LineChart,
  Area,
  AreaChart,
} from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { axios } from "@/lib/axios"
import { useAppSelector } from "@/hooks/useAppSelector"
import { useRouter } from "next/navigation"
import BackgroundLoader from "@/components/bg loader/BgLoader"
import { toast } from "sonner"
import { DetailsModal } from "@/components/application details/ApplicationDetails"
import { DialogTrigger } from "@/components/ui/dialog"
import Link from "next/link"
import { useAppDispatch } from "@/hooks/useAppDispatch"
import { getUserInfo } from "@/lib/redux/reducers/storeUserInfo"

// Mock data
// const notifications = [
//   { id: 1, message: "New application submitted by John Doe", read: false, time: "2 hours ago" },
//   { id: 2, message: "Jane Smith's application approved", read: false, time: "4 hours ago" },
//   { id: 3, message: "Payment processed for Bob's Garage", read: true, time: "1 day ago" },
//   { id: 4, message: "New user account created: Alice Williams", read: true, time: "2 days ago" },
//   { id: 5, message: "System update scheduled for next week", read: true, time: "3 days ago" },
// ]

const revenueData = [
  { name: "Jan", value: 4000 },
  { name: "Feb", value: 3000 },
  { name: "Mar", value: 6000 },
  { name: "Apr", value: 8000 },
  { name: "May", value: 5000 },
  { name: "Jun", value: 7000 },
]

const userActivityData = [
  { name: "Mon", value: 20 },
  { name: "Tue", value: 40 },
  { name: "Wed", value: 30 },
  { name: "Thu", value: 70 },
  { name: "Fri", value: 50 },
  { name: "Sat", value: 30 },
  { name: "Sun", value: 20 },
]

const totalUsers = 1000
const totalApplications = 250
const totalRevenue = 50000

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.5
}

const pageVariants = {
  initial: { opacity: 0, x: "-10%" },
  in: { opacity: 1, x: 0 },
  out: { opacity: 0, x: "10%" },
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.3,
      staggerChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1
  }
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(0)
  const [date, setDate] = useState<Date | undefined>(new Date())
  const [users, setUsers] = useState(null)
  const [applications, setApplications] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [percentageChange, setPercentageChange] = useState(0)
  const [applicationPercentageChange, setApplicationPercentageChange] = useState(0)
  const [notifications, setNotifications] = useState(null)
  const userData = useAppSelector(state => state.user.user)
  const router = useRouter()
  const dispatch = useAppDispatch()

  useEffect(() => {
    if(notifications){
    const unreadCount = notifications?.filter((n) => !n.isRead).length

    console.log(unreadCount)
    setUnreadNotifications(unreadCount)
    }
  }, [notifications])

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen)

  const navItems = [
    { name: "Dashboard", icon: ChartScatter, tab: "dashboard" },
    { name: "Applications", icon: ShoppingBag, tab: "applications" },
    { name: "Users", icon: Users, tab: "users" },
    { name: "Notifications", icon: Bell, tab: "notifications" },
    { name: "Settings", icon: Settings, tab: "settings" },
    { name: "Profile", icon: User, tab: "profile" },
  ]

  useEffect(() => {
    fetchAllPromises()
  }, [])

  const fetchAllPromises = async () => {
    try {
      await Promise.all([
        fetchUsersData(),
        fetchApplicationData(),
        fetchNotificationsData()
      ])
    }
    catch(err) {
      console.log(err)
    }
  }

  const fetchUsersData = async () => {
    try {
      // Fetch current users data
      const response = await axios.get('users/get');
      const currentUsers =  response.data.message;
      const currentUsersCount = currentUsers.length;
  
      // Get the saved user count from the end of last month from localStorage
      const savedData = JSON.parse(localStorage.getItem('monthlyUserData')) || {};
      const previousUsersCount = savedData.userCount || 0;
      const previousMonth = savedData.month || null;
  
      const currentMonth = new Date().getMonth();
  
      let percentageChange = 0;
  
      if (previousMonth !== currentMonth && previousUsersCount > 0) {
        percentageChange = ((currentUsersCount - previousUsersCount) / previousUsersCount) * 100;
      }
  
      if (previousMonth !== currentMonth) {
        const newMonthData = {
          userCount: currentUsersCount,
          month: currentMonth,
        };
        localStorage.setItem('monthlyUserData', JSON.stringify(newMonthData));
      }
  
      setUsers(currentUsers);
      setPercentageChange(percentageChange);
  
    } catch (err) {
      console.log(err);
    }
  };
  
  const fetchApplicationData = async () => {
    try {
      const response = await axios.get('pos-application/get');
      const currentApplications = response.data.message;
      const currentApplicationsCount = currentApplications.length;
  
      const savedData = JSON.parse(localStorage.getItem('monthlyApplicationData')) || {};
      const previousApplicationsCount = savedData.applicationsCount || 0;
      const previousMonth = savedData.month || null;
  
      const currentMonth = new Date().getMonth();
  
      let percentageChange = 0;
  
      if (previousMonth !== currentMonth && previousApplicationsCount > 0) {
        percentageChange = ((currentApplicationsCount - previousApplicationsCount) / previousApplicationsCount) * 100;
      }
  
      if (previousMonth !== currentMonth) {
        const newMonthData = {
          applicationsCount: currentApplicationsCount,
          month: currentMonth,
        };
        localStorage.setItem('monthlyApplicationData', JSON.stringify(newMonthData));
      }
  
      setApplications(currentApplications);
      setApplicationPercentageChange(percentageChange);
  
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);

  const fetchNotificationsData = async () => {
    try{
      const response = await axios.get('notifications/get')
  
      setNotifications(response.data.message.reverse())
      console.log(response.data)
    }
    catch(err){
      console.log(err)
    }
   }
  
   const logoutAccount = async () => {
    try{
        setIsLoading(true)
        console.log(userData, 'usrdta')
        const body = {
            authId: userData?.authId,
            userId: userData?._id
        }

        console.log(body)
        const response = await axios.post('admin/logout', body)

        dispatch(getUserInfo(null))
        console.log(response.data)

        toast("Logged out successfully", {
            description: "You have successfully logged out from your admin account",
            action: {
              label: "Cancel",
              onClick: () => console.log("Undo"),
            },
          })

        setTimeout(() => {
            router.push('/login')
        }, 1000);
    }
    catch(err){
        console.log(err)
    }
    finally{
        setIsLoading(false)
    }
   }

   
  const SidebarContent = () => (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      exit={{ x: -300, opacity: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="flex flex-col h-full"
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold text-orange-600">Admin Panel</h2>
      </div>
      <ScrollArea className="flex-grow">
        <nav className="space-y-2 p-4">
          {navItems.map((item) => (
            <motion.div
              key={item.tab}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant={activeTab === item.tab ? "default" : "ghost"}
                className="w-full justify-start"
                onClick={() => {
                  setActiveTab(item.tab)
                  setIsSidebarOpen(false)
                }}
              >
                <item.icon className="mr-2 h-4 w-4" />
                {item.name}
              </Button>
            </motion.div>
          ))}
        </nav>
      </ScrollArea>
    </motion.div>
  )

  return (
    <>

    <BackgroundLoader isLoading={isLoading} setIsLoading={setIsLoading}/>
    <div className="flex h-screen bg-gray-50">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 bg-white shadow-md">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <main className="flex-1 overflow-hidden">
        <motion.header
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-white shadow-sm border-b border-orange-100"
        >
          <div className="flex items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" className="lg:hidden mr-2" onClick={toggleSidebar}>
                <Menu className="h-6 w-6" />
              </Button>
              <motion.h1
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-semibold text-orange-600"
              >
                {navItems.find((item) => item.tab === activeTab)?.name}
              </motion.h1>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative hidden lg:block">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  type="search"
                  placeholder="Search..."
                  className="pl-8 w-[200px] lg:w-[300px]"
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon" className="relative">
                    <Bell className="h-4 w-4" />
                    {unreadNotifications > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {unreadNotifications}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {notifications?.slice(0, 3).map((notification) => (
                    <DropdownMenuItem key={notification.id}>
                      <div className="flex flex-col space-y-1">
                        <span className={notification.read ? "text-muted-foreground" : "font-medium"}>
                          {notification.description}
                        </span>
                        <span className="text-xs text-muted-foreground">{notification.createdAt}</span>
                      </div>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Button
                      variant="ghost"
                      className="w-full justify-center"
                      onClick={() => setActiveTab("notifications")}
                    >
                      View all notifications
                    </Button>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder.svg" alt="Admin" />
                      <AvatarFallback>AD</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setActiveTab("profile")}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveTab("settings")}>
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logoutAccount}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </motion.header>

        <div className="p-4 sm:p-6 lg:p-8 overflow-auto  h-[calc(100vh-4rem)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              {activeTab === "dashboard" && <DashboardContent applicationPercentageChange={applicationPercentageChange} percentageChange={percentageChange} users={users} applications={applications}/>}
              {activeTab === "applications" && <ApplicationsContent applications={applications}/>}
              {activeTab === "users" && <UsersContent users={users}/>}
              {activeTab === "notifications" && <NotificationsContent updateNotificationUnreadCount={setUnreadNotifications} notifications={notifications}/>}
              {activeTab === "settings" && <SettingsContent />}
              {activeTab === "profile" && <ProfileContent isLoading={isLoading} userData={userData} logoutAccount={logoutAccount}/>}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
    </>
  )
}

function DashboardContent({users, applications, applicationPercentageChange, percentageChange}) {
     const [isMainModalOpen, setIsMainModalOpen] = useState(false)
     const [details, setDetails] = useState(null)

     useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
      }, []);

     const onModalChange = () => {
        setIsMainModalOpen(false)
     }

     const viewDetailsOfApplication = async (id) => {
        try{
            setIsMainModalOpen(true)

            const response = await axios.get(`pos-application/details/${id}`)

            setDetails(response.data.message)
        }
        catch(err){
        }
     }
  return (
    <>
      <DetailsModal application={details} isMainModalOpen={isMainModalOpen} onOpenChange={onModalChange}/>  
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-2">
        <AnimatedCard title="Total Users" icon={Users} value={users?.length} change={`${percentageChange.toFixed(2)}%`} />
        <AnimatedCard title="Total Applications" icon={ShoppingBag} value={applications?.length} change={`${applicationPercentageChange.toFixed(2)}%`}/>
      </motion.div>
      <motion.div variants={itemVariants} className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <POSApplicationChart applications={applications} />
        <Card className="col-span-4 lg:col-span-3 w-full">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>You have {applications?.length} total applications</CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8 w-full">
              {applications?.slice(0, 5).map((app, index) => (
                <motion.div key={app._id} variants={itemVariants} className="flex items-center">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={app.imageUrl} alt={app.fullName} />
                    <AvatarFallback>{app.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="ml-4 space-y-1">
                    <p className="text-sm font-medium leading-none">{app.fullName}</p>
                    <p className="text-sm text-muted-foreground capitalize">{`Just Bought ${app.posType} `}</p>
                  </div>
                  <Button variant={'outline'} onClick={() => viewDetailsOfApplication(app._id)} className="ml-auto font-medium">
                     Details
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
    </>
  )
}

function AnimatedCard({ title, icon: Icon, value, change }) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{title}</CardTitle>
          <Icon className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="text-2xl font-bold"
          >
            {value}
          </motion.div>
          <p className="text-xs text-muted-foreground">{change} from last month</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function POSApplicationChart({ applications }) {
  const chartData = applications?.reduce((acc, curr) => {
    const existingState = acc.find(item => item.state === curr.state)
    if (existingState) {
      existingState.count++
    } else {
      acc.push({ state: curr.state, count: 1 })
    }
    return acc
  }, [])

  return (
    <Card className="col-span-4 overflow-scroll">
      <CardHeader>
        <CardTitle>POS Applications by State</CardTitle>
        <CardDescription>Distribution of POS applications across different states</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            count: {
              label: "Applications",
              color: "hsl(var(--chart-1))",
            },
          }}
          className="h-[300px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="state" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="var(--color-count)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

function ApplicationsContent({applications}) {
    const [isMainModalOpen, setIsMainModalOpen] = useState(false)
    const [details, setDetails] = useState(null)

    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
      }, []);
    const onModalChange = () => {
       setIsMainModalOpen(false)
    }

    const viewDetailsOfApplication = async (id) => {
       try{
           setIsMainModalOpen(true)

           const response = await axios.get(`pos-application/details/${id}`)

           setDetails(response.data.message)
       }
       catch(err){
       }
    }

  return (
    <>
      <DetailsModal application={details} isMainModalOpen={isMainModalOpen} onOpenChange={onModalChange}/> 
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card>
        <CardHeader>
          <CardTitle>Recent Applications</CardTitle>
          <CardDescription>You have {applications?.length} total applications</CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-8">
            {applications?.map((app) => (
              <motion.div key={app._id} variants={itemVariants} className="flex items-center">
                <Avatar className="h-9 w-9">
                  <AvatarImage src={app.imageUrl} alt={app.fullName} />
                  <AvatarFallback>{app.fullName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="ml-4 space-y-1">
                  <p className="text-sm font-medium leading-none">{app.fullName}</p>
                  <p className="text-sm capitalize text-muted-foreground">{`Just Bought ${app.posType} `}</p>
                </div>
                <Button variant={'outline'} onClick={() => viewDetailsOfApplication(app._id)} className="ml-auto font-medium">
                     Details
                  </Button>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
    </>
  )
}

function UsersContent({users}) {

    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);
      }, []);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Manage your users and their permissions</CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
            {users?.map((user) => (
              <motion.div
                key={user._id}
                variants={itemVariants}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>{user?.fullName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{user.fullName}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <ChevronDown className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                        <Link href={`mailto:${user.email}`}>
                        Email User
                        </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function NotificationsContent({notifications, updateNotificationUnreadCount}) {

    useEffect(() => {
        // Scroll to the top of the page when the component mounts
        window.scrollTo(0, 0);

        markNotificationsAsRead()
      }, []);


    const markNotificationsAsRead = async () => {
        try{
            const response = await axios.patch('notifications/update')

            updateNotificationUnreadCount(0)
            console.log(response.data)
        }
        catch(err){
            console.log(err)
        }
    }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
          <CardDescription>Your recent notifications</CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
            {notifications?.map((notification) => (
              <motion.div
                key={notification.id}
                variants={itemVariants}
                className="flex items-start space-x-4 p-4 border rounded-lg"
              >
                <AlertCircle className="h-5 w-5 mt-0.5 text-orange-500" />
                <div className="flex-1">
                  <p className={notification.read ? "text-muted-foreground" : "font-medium"}>
                    {notification.description}
                  </p>
                  <p className="text-sm text-muted-foreground">{notification.time}</p>
                </div>
                {/* <Button variant="ghost" size="sm">
                  Mark as read
                </Button> */}
              </motion.div>
            ))}
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}


function SettingsContent() {
  const { register, handleSubmit, watch, formState: { errors } } = useForm()
  const [isLoading, setIsLoading] = useState(false)
  const userData = useAppSelector(state => state.user.user)

  useEffect(() => {
    // Scroll to the top of the page when the component mounts
    window.scrollTo(0, 0);
  }, []);

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      const body = {
        password: data.newPassword,
        userId: userData.authId
      }

      const response = await axios.patch('admin/update/password', body)

      console.log(response.data)

      
      toast("Password Changed Successfully", {
        description: "",
        action: {
          label: "Cancel",
          onClick: () => console.log("Undo"),
        },
      })

    } catch (err) {
      console.error(err)
      toast('Something went wrong.',{
        description: "Failed to update password. Please try again.",
        action: {
            label: "Cancel",
            onClick: () => console.log("Undo"),
          },
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* <BackgroundLoader isLoading={isLoading} setIsLoading={setIsLoading} /> */}
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Manage your account settings and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="password" className="w-full">
            <TabsList>
              <TabsTrigger value="password">Password</TabsTrigger>
              <TabsTrigger value="notifications">Notifications</TabsTrigger>
            </TabsList>
            <TabsContent value="password">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    {...register("newPassword", { 
                      required: "New password is required",
                      minLength: {
                        value: 8,
                        message: "Password must be at least 8 characters long"
                      }
                    })}
                  />
                  {errors.newPassword && (
                    <p className="text-sm text-red-500">{errors.newPassword.message}</p>
                  )}
                </motion.div>
                <motion.div variants={itemVariants} className="space-y-2">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    {...register("confirmPassword", {
                      required: "Please confirm your password",
                      validate: (val) => {
                        if (watch('newPassword') != val) {
                          return "Your passwords do not match";
                        }
                      },
                    })}
                  />
                  {errors.confirmPassword && (
                    <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
                  )}
                </motion.div>
                <motion.div variants={itemVariants}>
                  <Button type="submit" disabled={isLoading}>
                    {isLoading ? "Updating..." : "Update Password"}
                  </Button>
                </motion.div>
              </form>
            </TabsContent>
            <TabsContent value="notifications">
              <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-4">
                <motion.div variants={itemVariants} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Notifications</p>
                    <p className="text-sm text-muted-foreground">Receive email about your account activity</p>
                  </div>
                  <Switch checked={true} id="email-notifications" />
                </motion.div>
        
              </motion.div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}

function ProfileContent({userData, logoutAccount, isLoading}) {
  const profile = {
    fullName: "Admin User",
    role: "Administrator",
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <Card>
        <CardHeader>
          <CardTitle>Profile Information</CardTitle>
          <CardDescription>Your account details and information</CardDescription>
        </CardHeader>
        <CardContent>
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <motion.div variants={itemVariants} className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src="/placeholder.svg" alt={profile.fullName} />
                <AvatarFallback>{profile.fullName.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{profile.fullName}</h2>
                <p className="text-muted-foreground">{profile.role}</p>
              </div>
            </motion.div>
            <Separator />
            <motion.div variants={itemVariants} className="space-y-2">
              <Label>Email</Label>
              <p>{userData.email}</p>
            </motion.div>
            <motion.div variants={itemVariants} className="space-y-2">
              <Label>Join Date</Label>
              <p>{userData?.createdAt}</p>
            </motion.div>
            <Separator />
            <motion.div variants={itemVariants} className="flex space-x-4">
              <Button onClick={logoutAccount}>{isLoading ? 'Logging out' : 'Logout'}</Button>
            </motion.div>
          </motion.div>
        </CardContent>
      </Card>
    </motion.div>
  )
}