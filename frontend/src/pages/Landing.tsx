import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  Building2, 
  Users, 
  Clock, 
  FileText, 
  BarChart3, 
  Shield, 
  Zap, 
  CheckCircle2,
  ArrowRight,
  Calendar,
  FolderKanban
} from 'lucide-react';
import { fadeInVariants, slideUpVariants, staggerContainer, scaleInVariants } from '@/animations/motionVariants';

export default function Landing() {
  const features = [
    {
      icon: Users,
      title: 'Employee Management',
      description: 'Comprehensive employee profiles, roles, and organizational structure management.',
    },
    {
      icon: Clock,
      title: 'Attendance Tracking',
      description: 'Real-time attendance monitoring with automated reporting and analytics.',
    },
    {
      icon: Calendar,
      title: 'Leave Management',
      description: 'Streamlined leave requests, approvals, and calendar integration.',
    },
    {
      icon: FolderKanban,
      title: 'Project Management',
      description: 'Track projects, assign tasks, and monitor team progress in real-time.',
    },
    {
      icon: FileText,
      title: 'Document Management',
      description: 'Secure document storage, version control, and easy access.',
    },
    {
      icon: BarChart3,
      title: 'Analytics & Reports',
      description: 'Powerful insights with customizable reports and data visualization.',
    },
  ];

  const benefits = [
    'Enterprise-grade security',
    '99.9% uptime guarantee',
    'Real-time collaboration',
    'Mobile-responsive design',
    '24/7 customer support',
    'Scalable infrastructure',
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-secondary/5">
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        <div className="container mx-auto px-4 py-20 lg:py-32">
          <motion.div
            className="max-w-4xl mx-auto text-center"
            initial="initial"
            animate="animate"
            variants={staggerContainer}
          >
            <motion.div variants={fadeInVariants} className="flex justify-center mb-6">
              <div className="p-4 rounded-2xl bg-primary/10">
                <Building2 className="h-12 w-12 text-primary" />
              </div>
            </motion.div>
            
            <motion.h1
              variants={slideUpVariants}
              className="text-5xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent"
            >
              Streamline Your Workforce
              <br />
              <span className="text-primary">Management</span>
            </motion.h1>
            
            <motion.p
              variants={slideUpVariants}
              className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto"
            >
              A complete enterprise solution for managing employees, attendance, leaves, projects, and generating insightful reports. Built for modern teams.
            </motion.p>
            
            <motion.div
              variants={slideUpVariants}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/login">
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="text-lg px-8">
                <a href="#features">Learn More</a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32 bg-background">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="max-w-3xl mx-auto text-center mb-16"
          >
            <motion.h2
              variants={slideUpVariants}
              className="text-4xl lg:text-5xl font-bold mb-4"
            >
              Everything You Need
            </motion.h2>
            <motion.p
              variants={slideUpVariants}
              className="text-xl text-muted-foreground"
            >
              Powerful features designed to make workforce management effortless
            </motion.p>
          </motion.div>

          <motion.div
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
          >
            {features.map((feature, index) => (
              <motion.div
                key={index}
                variants={slideUpVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="p-6 rounded-xl border bg-card hover:shadow-lg transition-shadow"
              >
                <div className="p-3 rounded-lg bg-primary/10 w-fit mb-4">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Trust & Scale Section */}
      <section className="py-20 lg:py-32 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={staggerContainer}
            >
              <motion.div variants={slideUpVariants}>
                <h2 className="text-4xl lg:text-5xl font-bold mb-6">
                  Trusted by Enterprise Teams
                </h2>
                <p className="text-xl text-muted-foreground mb-8">
                  Join thousands of companies that rely on YVI EMS to manage their workforce efficiently.
                </p>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={index}
                      variants={fadeInVariants}
                      className="flex items-center gap-3"
                    >
                      <CheckCircle2 className="h-5 w-5 text-success flex-shrink-0" />
                      <span className="text-lg">{benefit}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
              
              <motion.div
                variants={slideUpVariants}
                className="grid grid-cols-3 gap-6"
              >
                {[
                  { value: '500+', label: 'Companies' },
                  { value: '50K+', label: 'Employees' },
                  { value: '99.9%', label: 'Uptime' },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={scaleInVariants}
                    className="text-center p-6 rounded-xl bg-card border"
                  >
                    <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                    <div className="text-sm text-muted-foreground">{stat.label}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-32 bg-gradient-to-br from-primary/10 via-background to-secondary/10">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-3xl mx-auto text-center"
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            <motion.h2
              variants={slideUpVariants}
              className="text-4xl lg:text-5xl font-bold mb-6"
            >
              Ready to Transform Your Workforce Management?
            </motion.h2>
            <motion.p
              variants={slideUpVariants}
              className="text-xl text-muted-foreground mb-10"
            >
              Get started today and experience the power of enterprise-grade workforce management.
            </motion.p>
            <motion.div variants={slideUpVariants}>
              <Button asChild size="lg" className="text-lg px-8">
                <Link to="/login">
                  Start Free Trial
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

