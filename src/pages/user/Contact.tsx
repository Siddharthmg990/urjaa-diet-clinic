
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
    window.location.href = "tel:+919284735115";
  };

  const handleWhatsApp = () => {
    window.location.href = "https://wa.me/919284735115";
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
                  <div className="text-sm opacity-80">+91 9284735115</div>
                </div>
              </button>

              <a 
                href="mailto:urjaadc@gmail.com"
                className="w-full flex items-center p-3 bg-nourish-light hover:bg-nourish-primary hover:text-white rounded-md transition-colors duration-200"
              >
                <Mail className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div className="font-medium">Email Us</div>
                  <div className="text-sm opacity-80">urjaadc@gmail.com</div>
                </div>
              </a>

              <button 
                onClick={handleWhatsApp}
                className="w-full flex items-center p-3 bg-nourish-light hover:bg-nourish-primary hover:text-white rounded-md transition-colors duration-200"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5 mr-3 fill-current">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                <div className="text-left">
                  <div className="font-medium">WhatsApp</div>
                  <div className="text-sm opacity-80">+91 9284735115</div>
                </div>
              </button>
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
                  Law College Road<br />
                  Pune-411004<br />
                  Maharashtra, India
                </address>
              </div>
              
              <div className="flex">
                <Clock className="h-5 w-5 text-nourish-primary mr-3 shrink-0" />
                <div className="text-sm">
                  <div className="font-medium">Hours</div>
                  <div>Monday - Friday: 11am - 3pm</div>
                  <div>Saturday & Sunday: Closed</div>
                </div>
              </div>

              <div className="flex">
                <Phone className="h-5 w-5 text-nourish-primary mr-3 shrink-0" />
                <div className="text-sm">
                  <div className="font-medium">Phone</div>
                  <div>+91 9284735115</div>
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
                For urgent matters, please call us directly at +91 9284735115
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
