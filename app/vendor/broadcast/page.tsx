"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
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
} from "@/components/ui/dialog";
import {
  Send,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  MessageSquare,
  Users,
  RefreshCw,
} from "lucide-react";

// Mock data - replace with API
const mockBroadcast = {
  todayMenu: "Dal Makhani, Jeera Rice, Mixed Veg, Butter Naan, Salad",
  vendorName: "Maa Ki Rasoi",
  totalSubscribers: 47,
  optedInForWhatsApp: 42,
  recipients: 42,
  lastSent: "2025-03-28T18:30:00",
  status: "DRAFT", // DRAFT, SENDING, SENT, FAILED
};

const messageTemplates = [
  {
    name: "Standard Daily Menu",
    template: `🍛 Good morning! {vendorName} here.

Today's Menu:
{todayMenu}

📋 If you want to PAUSE today's meal, please REPLY with PAUSE before 8 PM.
📞 Need assistance? Call us at {vendorPhone}

- TiffinHub`,
  },
  {
    name: "Short & Sweet",
    template: `Hello from {vendorName}! 👋

Today: {todayMenu}

Reply PAUSE to skip. Questions? {vendorPhone}`,
  },
  {
    name: "With Emojis",
    template: `🔥 *{vendorName} - Today's Menu* 🔥

🍛 *Menu:*
{todayMenu}

⏰ *Pause Deadline:* 8 PM today
📱 *To pause:* Reply PAUSE
📞 *Contact:* {vendorPhone}

Stay healthy! 💪`,
  },
];

export default function VendorBroadcastPage() {
  const [broadcast, setBroadcast] = useState(mockBroadcast);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    // Fetch today's menu and broadcast status
    // In real app, this would be an API call
  }, []);

  const todayMenu = broadcast.todayMenu;
  const recipients = broadcast.recipients;
  const canSend = broadcast.status === "DRAFT" || broadcast.status === "FAILED";

  const handleTemplateSelect = (template: string) => {
    let message = template
      .replace(/{vendorName}/g, broadcast.vendorName)
      .replace(/{todayMenu}/g, todayMenu)
      .replace(/{vendorPhone}/g, "9876543210");

    setCustomMessage(message);
    setSelectedTemplate(template);
  };

  const handleSendBroadcast = async () => {
    if (!customMessage.trim()) {
      alert("Please enter a message");
      return;
    }

    setIsSending(true);
    setBroadcast((prev) => ({ ...prev, status: "SENDING" }));

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 3000));

      setBroadcast((prev) => ({
        ...prev,
        status: "SENT",
        lastSent: new Date().toISOString(),
      }));

      setShowConfirm(false);
      setCustomMessage("");
      setSelectedTemplate("");
    } catch (error) {
      setBroadcast((prev) => ({ ...prev, status: "FAILED" }));
      alert("Failed to send broadcast. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const getStatusDetails = () => {
    switch (broadcast.status) {
      case "DRAFT":
        return {
          icon: <Clock className="h-5 w-5" />,
          color: "text-gray-500",
          bgColor: "bg-gray-100",
          label: "Draft",
        };
      case "SENDING":
        return {
          icon: <RefreshCw className="h-5 w-5 animate-spin" />,
          color: "text-blue-500",
          bgColor: "bg-blue-50",
          label: "Sending...",
        };
      case "SENT":
        return {
          icon: <CheckCircle className="h-5 w-5" />,
          color: "text-brand-green",
          bgColor: "bg-green-50",
          label: "Sent",
        };
      case "FAILED":
        return {
          icon: <XCircle className="h-5 w-5" />,
          color: "text-red-500",
          bgColor: "bg-red-50",
          label: "Failed",
        };
      default:
        return {
          icon: <Clock className="h-5 w-5" />,
          color: "text-gray-500",
          bgColor: "bg-gray-100",
          label: "Unknown",
        };
    }
  };

  const statusDetails = getStatusDetails();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-brand-slate">
            WhatsApp Broadcast
          </h1>
          <p className="text-gray-600">
            Send today's menu to all active subscribers
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            className={`px-3 py-1 ${statusDetails.bgColor} ${statusDetails.color}`}
          >
            {statusDetails.icon}
            <span className="ml-1">{statusDetails.label}</span>
          </Badge>
          {broadcast.status === "SENT" && (
            <span className="text-sm text-gray-500">
              {new Date(broadcast.lastSent).toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Stats & Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-brand-amber" />
                Recipients
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Subscribers</span>
                  <span className="font-bold">
                    {broadcast.totalSubscribers}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">WhatsApp Opt-in</span>
                  <span className="font-bold">
                    {broadcast.optedInForWhatsApp}
                  </span>
                </div>
                <Separator />
                <div className="flex justify-between text-lg font-bold text-brand-slate">
                  <span>Today's Recipients</span>
                  <span>{recipients}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-brand-amber" />
                Message Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              {customMessage ? (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg whitespace-pre-wrap text-sm">
                  {customMessage}
                </div>
              ) : (
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 text-sm">
                  Select a template or enter a custom message...
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-900 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Important Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-blue-800 space-y-2">
              <p>
                • Broadcast will be sent to subscribers who opted for WhatsApp
                notifications.
              </p>
              <p>• Messages will be sent via Twilio WhatsApp Business API.</p>
              <p>• Standard WhatsApp messaging rates apply.</p>
              <p>• Recipients who paused today will NOT receive messages.</p>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Editor */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Compose Message</CardTitle>
              <CardDescription>
                Choose a template or write your own message
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Template Selector */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Quick Templates
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {messageTemplates.map((template) => (
                    <Button
                      key={template.name}
                      type="button"
                      variant={
                        selectedTemplate === template.template
                          ? "default"
                          : "outline"
                      }
                      className="h-auto p-3 text-left"
                      onClick={() => handleTemplateSelect(template.template)}
                    >
                      <div>
                        <p className="font-medium text-sm">{template.name}</p>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Message Editor */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Custom Message
                  <span className="text-gray-500 font-normal ml-2">
                    (Variables: {"{vendorName}"}, {"{todayMenu}"},{" "}
                    {"{vendorPhone}"})
                  </span>
                </label>
                <Textarea
                  placeholder="Type your WhatsApp message here..."
                  value={customMessage}
                  onChange={(e) => setCustomMessage(e.target.value)}
                  className="min-h-[300px] font-mono text-sm"
                />
              </div>

              {/* Character Count */}
              <div className="flex justify-between text-sm text-gray-500">
                <span>WhatsApp limit: ~4096 characters</span>
                <span>{customMessage.length} / 4096</span>
              </div>
            </CardContent>
            <CardFooter className="border-t">
              <div className="w-full flex justify-between items-center">
                <div className="text-sm text-gray-600">
                  {customMessage ? (
                    <span>
                      Will be sent to <strong>{recipients}</strong> recipients
                    </span>
                  ) : (
                    <span>Select a template or create a message</span>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setCustomMessage("");
                      setSelectedTemplate("");
                    }}
                  >
                    Clear
                  </Button>

                  <AlertDialog open={showConfirm} onOpenChange={setShowConfirm}>
                    <AlertDialogTrigger asChild>
                      <Button
                        disabled={!canSend || !customMessage.trim()}
                        className="bg-brand-green hover:bg-green-600 gap-2"
                      >
                        <Send className="h-4 w-4" />
                        Send Broadcast
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Send WhatsApp Broadcast?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will send your message to {recipients}{" "}
                          subscribers via WhatsApp.
                          <br />
                          <br />
                          <strong>Message preview:</strong>
                          <br />
                          {customMessage.substring(0, 200)}
                          {customMessage.length > 200 && "..."}
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleSendBroadcast}
                          disabled={isSending}
                        >
                          {isSending ? (
                            <>Sending...</>
                          ) : (
                            <>Yes, Send to {recipients} recipients</>
                          )}
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            </CardFooter>
          </Card>

          {/* Recent Broadcasts */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Broadcasts</CardTitle>
              <CardDescription>History of sent messages</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  {
                    date: "2025-03-28 6:30 PM",
                    status: "sent",
                    recipients: 42,
                  },
                  {
                    date: "2025-03-27 7:15 PM",
                    status: "sent",
                    recipients: 45,
                  },
                  {
                    date: "2025-03-26 7:30 PM",
                    status: "sent",
                    recipients: 44,
                  },
                  {
                    date: "2025-03-25 8:00 PM",
                    status: "sent",
                    recipients: 46,
                  },
                ].map((broadcast, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-brand-slate">
                        {broadcast.date}
                      </p>
                      <p className="text-sm text-gray-500">
                        {broadcast.recipients} recipients
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-green-50 text-green-700 border-green-200"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Sent
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
