import { TabsSection } from '@/components/tabs';

export default function Home() {
  return (
    <main className="min-h-screen bg-linear-to-br from-background via-background to-muted/20">
      <div className="border-b border-border/40 bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Image Processor
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Professional image processing toolkit
              </p>
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-medium text-primary">Ready</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <TabsSection />
      </div>
    </main>
  );
}
