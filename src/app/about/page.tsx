import type { Metadata } from "next";
import Image from "next/image";
import { CheckCircle, Users, Award, Globe, Zap, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export const metadata: Metadata = {
  title: "About Us | Uptix Digital",
  description:
    "Learn about Uptix Digital - a premium web and app development agency dedicated to transforming businesses through innovative digital solutions.",
};

const stats = [
  { number: "50+", label: "Projects Completed" },
  { number: "30+", label: "Happy Clients" },
  { number: "5+", label: "Years Experience" },
  { number: "100%", label: "Client Satisfaction" },
];

const values = [
  {
    icon: Zap,
    title: "Innovation",
    description:
      "We stay ahead of technology trends to deliver cutting-edge solutions.",
  },
  {
    icon: Heart,
    title: "Passion",
    description: "We love what we do and put our heart into every project.",
  },
  {
    icon: Users,
    title: "Collaboration",
    description:
      "We work closely with clients to ensure their vision comes to life.",
  },
  {
    icon: Award,
    title: "Excellence",
    description:
      "We maintain the highest standards in code quality and design.",
  },
];

const services = [
  "Custom Web Development",
  "Mobile App Development",
  "UI/UX Design",
  "API Development",
  "Performance Optimization",
  "Digital Consulting",
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-32 pb-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <span className="text-blue-400 font-mono text-sm">
            {"// ABOUT US"}
          </span>
          <h1 className="text-4xl md:text-5xl font-bold mt-2 mb-4">
            Building Digital <span className="gradient-text">Excellence</span>
          </h1>
          <p className="text-slate-400 max-w-3xl mx-auto font-mono text-lg">
            We are a team of passionate developers, designers, and digital
            strategists dedicated to transforming businesses through innovative
            technology solutions.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <Card
              key={index}
              className="glass-card border-white/10 text-center"
            >
              <CardContent className="pt-6">
                <div className="text-3xl md:text-4xl font-bold gradient-text mb-2">
                  {stat.number}
                </div>
                <div className="text-slate-400 text-sm">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mission Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          <div>
            <span className="text-blue-400 font-mono text-sm">
              {"// OUR MISSION"}
            </span>
            <h2 className="text-3xl font-bold mt-2 mb-4">
              Empowering Businesses Through{" "}
              <span className="gradient-text">Technology</span>
            </h2>
            <p className="text-slate-400 mb-6 leading-relaxed">
              At Uptix Digital, we believe that technology should be an enabler,
              not a barrier. Our mission is to democratize access to
              high-quality digital solutions, making enterprise-grade
              development accessible to businesses of all sizes.
            </p>
            <p className="text-slate-400 mb-6 leading-relaxed">
              We combine technical expertise with creative problem-solving to
              deliver solutions that not only meet but exceed our clients&apos;
              expectations. Every line of code we write is crafted with
              precision, performance, and scalability in mind.
            </p>
            <div className="space-y-3">
              {services.map((service, index) => (
                <div key={index} className="flex items-center text-slate-300">
                  <CheckCircle className="w-5 h-5 text-blue-400 mr-3" />
                  {service}
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-2xl blur-2xl" />
            <div className="relative glass-card border-white/10 rounded-2xl p-8">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="h-32 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-lg flex items-center justify-center">
                    <Globe className="w-12 h-12 text-blue-400" />
                  </div>
                  <div className="h-24 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-lg" />
                </div>
                <div className="space-y-4 pt-8">
                  <div className="h-24 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-lg" />
                  <div className="h-32 bg-gradient-to-br from-purple-500/20 to-purple-600/20 rounded-lg flex items-center justify-center">
                    <Zap className="w-12 h-12 text-purple-400" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <span className="text-blue-400 font-mono text-sm">
              {"// OUR VALUES"}
            </span>
            <h2 className="text-3xl font-bold mt-2">
              What Drives <span className="gradient-text">Us</span>
            </h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="glass-card border-white/10">
                <CardContent className="pt-6">
                  <value.icon className="w-10 h-10 text-blue-400 mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {value.title}
                  </h3>
                  <p className="text-slate-400 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="glass-card border-white/10 rounded-2xl p-8 md:p-12">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-blue-400 font-mono text-sm">
                {"// WHY CHOOSE US"}
              </span>
              <h2 className="text-3xl font-bold mt-2 mb-4">
                Your Success Is Our{" "}
                <span className="gradient-text">Priority</span>
              </h2>
              <p className="text-slate-400 mb-6 leading-relaxed">
                We don&apos;t just build websites and apps—we build
                partnerships. Our client-centric approach ensures that we
                understand your business goals and deliver solutions that drive
                real results.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center mr-4 mt-1">
                    <span className="text-blue-400 font-bold text-sm">1</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">
                      Transparent Communication
                    </h4>
                    <p className="text-slate-400 text-sm">
                      Regular updates and clear timelines throughout the
                      project.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center mr-4 mt-1">
                    <span className="text-purple-400 font-bold text-sm">2</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">
                      Quality Assurance
                    </h4>
                    <p className="text-slate-400 text-sm">
                      Rigorous testing and code reviews before deployment.
                    </p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center mr-4 mt-1">
                    <span className="text-pink-400 font-bold text-sm">3</span>
                  </div>
                  <div>
                    <h4 className="text-white font-semibold">
                      Ongoing Support
                    </h4>
                    <p className="text-slate-400 text-sm">
                      We&apos;re here for you even after the project is
                      complete.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="absolute -inset-4 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-2xl blur-2xl" />
              <div className="relative space-y-4">
                <div className="glass-card border-white/10 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-xl">
                      JD
                    </div>
                    <div className="ml-4">
                      <div className="text-white font-semibold">John Doe</div>
                      <div className="text-slate-400 text-sm">
                        CEO, TechStart Inc.
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-300 italic">
                    &quot;Uptix Digital transformed our online presence
                    completely. Their attention to detail and technical
                    expertise is unmatched.&quot;
                  </p>
                </div>
                <div className="glass-card border-white/10 rounded-xl p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                      SK
                    </div>
                    <div className="ml-4">
                      <div className="text-white font-semibold">Sarah Kim</div>
                      <div className="text-slate-400 text-sm">
                        Founder, StyleHub
                      </div>
                    </div>
                  </div>
                  <p className="text-slate-300 italic">
                    &quot;Working with Uptix was a game-changer for our
                    e-commerce business. Highly recommended!&quot;
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Your <span className="gradient-text">Project?</span>
          </h2>
          <p className="text-slate-400 mb-8 max-w-2xl mx-auto">
            Let&apos;s discuss how we can help transform your business with
            cutting-edge digital solutions.
          </p>
          <a
            href="/contact"
            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg font-semibold hover:opacity-90 transition-opacity"
          >
            Get In Touch
          </a>
        </div>
      </div>
    </div>
  );
}
