"use client"

import { useState } from "react"
import { format, addDays, startOfWeek, addWeeks, subWeeks } from "date-fns"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Textarea } from "@/components/ui/textarea"
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Save, Check, Clock, Plus, Trash2 } from "lucide-react"

// Mock data - replace with API
const initialMenuData: Record<string, {
  id?: string;
  description?: string;
  items: string;
  isPublished: boolean;
}> = {
  [format(new Date(), 'yyyy-MM-dd')]: {
    items: "Dal Makhani, Jeera Rice, Mixed Veg, Butter Naan, Salad",
    description: "North Indian Thali",
    isPublished: true
  },
  [format(addDays(new Date(), 1), 'yyyy-MM-dd')]: {
    items: "Sambar Rice, Rasam, Curd Rice, Poriyal, Papad",
    description: "South Indian Thali",
    isPublished: false
  },
  [format(addDays(new Date(), 2), 'yyyy-MM-dd')]: {
    items: "Rajma Chawal, Tawa Roti, Onion Salad, Pickle",
    description: "Classic Rajma",
    isPublished: false
  },
}

export default function VendorMenuPage() {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(new Date()))
  const [selectedDate, setSelectedDate] = useState<Date>(new Date())
  const [menuData, setMenuData] = useState(initialMenuData)
  const [editorValue, setEditorValue] = useState("")
  const [editorDescription, setEditorDescription] = useState("")
  const [isSaving, setIsSaving] = useState(false)

  const selectedDateStr = format(selectedDate, 'yyyy-MM-dd')
  const currentMenu = menuData[selectedDateStr] || { items: "", description: "", isPublished: false }

  const weekDates = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i))

  const handleSelectDate = (date: Date) => {
    setSelectedDate(date)
    const dateStr = format(date, 'yyyy-MM-dd')
    const menu = menuData[dateStr] || { items: "", description: "", isPublished: false }
    setEditorValue(menu.items)
    setEditorDescription(menu.description || "")
  }

  const handleSaveMenu = async () => {
    setIsSaving(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    setMenuData(prev => ({
      ...prev,
      [selectedDateStr]: {
        ...prev[selectedDateStr],
        items: editorValue,
        description: editorDescription,
      }
    }))

    setIsSaving(false)
  }

  const handlePublishMenu = async () => {
    setIsSaving(true)

    await new Promise(resolve => setTimeout(resolve, 1000))

    setMenuData(prev => ({
      ...prev,
      [selectedDateStr]: {
        ...prev[selectedDateStr],
        isPublished: true,
      }
    }))

    setIsSaving(false)
  }

  const prevWeek = () => setCurrentWeek(subWeeks(currentWeek, 1))
  const nextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1))

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-slate">Daily Menu</h1>
          <p className="text-gray-600">Plan and publish your daily menus</p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleSaveMenu}
            disabled={isSaving}
            className="gap-2"
          >
            {isSaving ? (
              <>Saving...</>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Draft
              </>
            )}
          </Button>
          {!currentMenu.isPublished && (
            <Button
              onClick={handlePublishMenu}
              disabled={isSaving || !editorValue.trim()}
              className="gap-2 bg-brand-green hover:bg-green-600"
            >
              <Check className="h-4 w-4" />
              Publish
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar View */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Select Date</CardTitle>
              <CardDescription>Choose a date to edit its menu</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={(date) => date && handleSelectDate(date)}
                className="rounded-md border"
              />

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">This Week</span>
                  <div className="flex gap-1">
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={prevWeek}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" className="h-7 w-7" onClick={nextWeek}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  {weekDates.map(date => {
                    const dateStr = format(date, 'yyyy-MM-dd')
                    const menu = menuData[dateStr]
                    const isSelected = dateStr === selectedDateStr

                    return (
                      <div
                        key={dateStr}
                        onClick={() => handleSelectDate(date)}
                        className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors ${
                          isSelected ? 'bg-orange-50 border border-brand-amber' : 'hover:bg-gray-50'
                        }`}
                      >
                        <div>
                          <p className="text-sm font-medium">
                            {format(date, 'EEE')} ({format(date, 'dd MMM')})
                          </p>
                          {menu && (
                            <p className="text-xs text-gray-500 truncate max-w-[120px]">
                              {menu.description || menu.items.substring(0, 30)}...
                            </p>
                          )}
                        </div>
                        {menu?.isPublished && (
                          <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
                            <Check className="h-3 w-3 mr-1" />
                            Published
                          </Badge>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Menu Editor */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>
                    Menu for {format(selectedDate, 'EEEE, MMM dd, yyyy')}
                  </CardTitle>
                  <CardDescription>
                    {currentMenu.isPublished ? (
                      <span className="text-brand-green flex items-center gap-1">
                        <Check className="h-4 w-4" />
                        Published
                      </span>
                    ) : (
                      "Draft - Not yet published to customers"
                    )}
                  </CardDescription>
                </div>
                {currentMenu.isPublished && (
                  <Badge className="bg-green-100 text-green-800">Live</Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Menu Description (Optional)</label>
                <Input
                  placeholder="e.g., Special Friday Thali, Low Oil Day, etc."
                  value={editorDescription}
                  onChange={(e) => setEditorDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Menu Items</label>
                <Textarea
                  placeholder="Enter today's menu items, separated by commas or new lines. Example: Dal Rice, Mixed Veg, Butter Naan, Salad, Pickle"
                  value={editorValue}
                  onChange={(e) => setEditorValue(e.target.value)}
                  className="min-h-[200px]"
                />
                <p className="text-xs text-gray-500 mt-2">
                  💡 Tip: Be specific and descriptive. Mention the dishes clearly so customers know what to expect.
                </p>
              </div>

              {currentMenu.isPublished && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Menu Status
                  </h4>
                  <p className="text-sm text-green-800">
                    This menu has been published and sent to all active subscribers via WhatsApp or in-app notification.
                    Published on {format(new Date(), 'dd MMM yyyy, hh:mm a')}
                  </p>
                </div>
              )}
            </CardContent>
            <CardFooter className="border-t bg-gray-50">
              <div className="w-full flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {editorValue.split(',').filter(item => item.trim()).length} item{editorValue.split(',').filter(item => item.trim()).length !== 1 ? 's' : ''} listed
                </div>
                <div className="flex gap-2">
                  {currentMenu.isPublished && (
                    <Button variant="outline" size="sm" className="gap-1 text-red-600 border-red-200 hover:bg-red-50">
                      <Trash2 className="h-4 w-4" />
                      Unpublish
                    </Button>
                  )}
                  <Button onClick={handleSaveMenu} disabled={isSaving} className="gap-2">
                    <Save className="h-4 w-4" />
                    Save Draft
                  </Button>
                  {!currentMenu.isPublished && (
                    <Button onClick={handlePublishMenu} disabled={isSaving} className="gap-2 bg-brand-green hover:bg-green-600">
                      <Check className="h-4 w-4" />
                      Publish
                    </Button>
                  )}
                </div>
              </div>
            </CardFooter>
          </Card>

          {/* Menu Templates */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Quick Templates</CardTitle>
              <CardDescription>Common menu presets to speed up entry</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { name: "North Indian Thali", items: "Dal Makhani, Jeera Rice, Mixed Veg, Butter Naan, Salad, Pickle" },
                  { name: "South Indian Thali", items: "Sambar Rice, Rasam, Curd Rice, Poriyal, Papad, Vada" },
                  { name: "Gujarati Thali", items: "Dal, Rice, 2-3 Sabjis, Roti/Phulka, Chaas, Salad, Pickle, Papad" },
                  { name: "Healthy Bowl", items: "Grilled Chicken/Fish, Quinoa/Brown Rice, Steamed Vegetables, Greek Salad" },
                ].map((template) => (
                  <Button
                    key={template.name}
                    variant="outline"
                    className="h-auto p-3 flex-col items-start text-left"
                    onClick={() => setEditorValue(template.items)}
                  >
                    <span className="font-medium text-brand-slate">{template.name}</span>
                    <span className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {template.items}
                    </span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Upcoming Deadlines */}
          <Card className="bg-amber-50 border-amber-200">
            <CardHeader>
              <CardTitle className="text-amber-900 flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Publishing Deadlines
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-amber-800">
              <p className="mb-2">
                For best results, publish menus by <strong>8:00 PM</strong> the day before. This gives customers enough time to review and pause if needed.
              </p>
              <p>
                Today's deadline was <strong>8:00 PM</strong> yesterday. Consider publishing menus for tomorrow as soon as possible.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
