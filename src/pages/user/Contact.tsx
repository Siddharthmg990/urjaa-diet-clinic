
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Phone, MapPin, Mail, Clock, MessageSquare } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Contact = () => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission delay
    setTimeout(() => {
      toast({
        title: "Message Sent",
        description: "We'll get back to you as soon as possible.",
      });
      setSubject("");
      setMessage("");
      setIsSubmitting(false);
    }, 1000);
  };

  const handleCall = () => {
    // In a real app, this might use a device's native call functionality
    window.location.href = "tel:+12345678901";
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-nourish-dark mb-2">Contact Us</h1>
      <p className="text-gray-600 mb-6">
        Get in touch with our nutrition experts and support team
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Contact Methods */}
        <div className="space-y-4 md:col-span-1">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Contact Methods</CardTitle>
              <CardDescription>Different ways to reach us</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <button 
                onClick={handleCall}
                className="w-full flex items-center p-3 bg-nourish-light hover:bg-nourish-primary hover:text-white rounded-md transition-colors duration-200"
              >
                <Phone className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Call the Clinic</div>
                  <div className="text-sm opacity-80">Speak directly with our team</div>
                </div>
              </button>

              <a 
                href="mailto:contact@nourishconnect.com"
                className="w-full flex items-center p-3 bg-nourish-light hover:bg-nourish-primary hover:text-white rounded-md transition-colors duration-200"
              >
                <Mail className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Email Us</div>
                  <div className="text-sm opacity-80">Get a response within 24h</div>
                </div>
              </a>

              <a 
                href="#"
                className="w-full flex items-center p-3 bg-nourish-light hover:bg-nourish-primary hover:text-white rounded-md transition-colors duration-200"
              >
                <MessageSquare className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Live Chat</div>
                  <div className="text-sm opacity-80">Chat with our support team</div>
                </div>
              </a>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle>Clinic Information</CardTitle>
              <CardDescription>Main clinic location and hours</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex">
                <MapPin className="h-5 w-5 text-nourish-primary mr-3 shrink-0" />
                <address className="not-italic text-sm">
                  123 Nutrition Avenue<br />
                  Wellness District<br />
                  Healthville, HV 12345
                </address>
              </div>
              
              <div className="flex">
                <Clock className="h-5 w-5 text-nourish-primary mr-3 shrink-0" />
                <div className="text-sm">
                  <div className="font-medium">Hours</div>
                  <div>Monday - Friday: 9am - 6pm</div>
                  <div>Saturday: 10am - 2pm</div>
                  <div>Sunday: Closed</div>
                </div>
              </div>

              <div className="flex">
                <Phone className="h-5 w-5 text-nourish-primary mr-3 shrink-0" />
                <div className="text-sm">
                  <div className="font-medium">Phone</div>
                  <div>(123) 456-7890</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contact Form */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Send us a message</CardTitle>
            <CardDescription>
              Fill out the form below and we'll get back to you as soon as possible
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="What is your message about?"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="How can we help you?"
                  rows={6}
                  required
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full bg-nourish-primary hover:bg-nourish-dark"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>

              <p className="text-sm text-center text-gray-500 mt-4">
                For urgent matters, please call us directly at (123) 456-7890
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
