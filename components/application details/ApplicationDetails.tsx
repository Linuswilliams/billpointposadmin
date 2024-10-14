'use client'

import { useState } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mail, Phone, MapPin, Briefcase, User, MessageSquare, Receipt } from 'lucide-react'

interface DetailsModalProps {
  application: {
    fullName: string
    email: string
    phoneNumber: string
    posType: string
    businessName: string
    areYouAMerchant: string
    address: string
    state: string
    additionalComments: string
    imageUrl: string
  }
  isMainModalOpen: boolean
  onOpenChange: (open: boolean) => void
}

const MotionDialogContent = motion(DialogContent)

export function DetailsModal({ application, isMainModalOpen, onOpenChange }: DetailsModalProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  const DetailsRow = ({ icon: Icon, label, value }: { icon: any, label: string, value: string }) => (
    <div className="flex items-center space-x-2 py-2">
      <Icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
      <span className="font-medium text-sm whitespace-nowrap">{label}:</span>
      <span className="text-sm truncate">{value}</span>
    </div>
  )

  return (
    <>
      <Dialog open={isMainModalOpen} onOpenChange={onOpenChange}>
        <MotionDialogContent 
          className="z-50 backdrop-blur-sm max-w-[900px] w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="rounded-lg shadow-lg max-w-[800px] w-full mx-auto">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="text-2xl font-bold">Application Details</DialogTitle>
            </DialogHeader>
            <ScrollArea className="capitalize max-h-[80vh] px-6 pb-6 overflow-y-auto">
              <div className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20 cursor-pointer" onClick={() => setIsImageModalOpen(true)}>
                    <AvatarImage src={application?.imageUrl} alt={application?.fullName} />
                    <AvatarFallback>{application?.fullName[0]}</AvatarFallback>
                  </Avatar>
                

                  <div className="mt-6 ">
                              
                  <div>
                    <h3 className="text-xl font-semibold">{application?.fullName}</h3>
                  </div>
                  <div className='mt-6 flex flex-col md:flex-row space-x-0 md:space-x-5 space-y-3 md:space-y-0'>
             <Badge variant="secondary" className="">{application?.posType}</Badge>
                <Button onClick={() => setIsImageModalOpen(true)} variant="outline">
                  <Receipt className="w-4 h-4 mr-2" />
                  View Payment Receipt
                </Button>
                </div>
              </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardContent className="p-4 space-y-2">
                      <DetailsRow icon={Mail} label="Email" value={application?.email} />
                      <DetailsRow icon={Phone} label="Phone" value={application?.phoneNumber} />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-4 space-y-2">
                      <DetailsRow icon={Briefcase} label="Business" value={application?.businessName} />
                      <DetailsRow icon={User} label="Merchant" value={application?.areYouAMerchant} />
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardContent className="p-4 space-y-2">
                    <DetailsRow icon={MapPin} label="Address" value={application?.address} />
                    <DetailsRow icon={MapPin} label="State" value={application?.state} />
                  </CardContent>
                </Card>

                {application?.additionalComments && (
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex items-start space-x-2">
                        <MessageSquare className="w-5 h-5 text-muted-foreground mt-0.5 flex-shrink-0" />
                        <div>
                          <span className="font-medium text-sm">Additional Comments:</span>
                          <p className="text-sm mt-1">{application?.additionalComments}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
     
            </ScrollArea>
          </div>
        </MotionDialogContent>
      </Dialog>

      <Dialog open={isImageModalOpen} onOpenChange={setIsImageModalOpen}>
        <MotionDialogContent 
          className="z-50 backdrop-blur-sm max-w-3xl w-full"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="bg-background rounded-lg shadow-lg w-full mx-auto overflow-hidden">
            <DialogHeader className="p-6 pb-0">
              <DialogTitle className="text-2xl font-bold">Payment Receipt</DialogTitle>
            </DialogHeader>
            <div className="relative w-full h-[400px] m-6 rounded-lg overflow-hidden">
              <Image
                src={application?.imageUrl}
                alt={application?.fullName}
                layout="fill"
                className="hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-6 pt-0">
              <Button onClick={() => setIsImageModalOpen(false)}>Close</Button>
            </div>
          </div>
        </MotionDialogContent>
      </Dialog>
    </>
  )
}