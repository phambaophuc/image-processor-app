'use client';

import { useState } from 'react';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui';
import { BatchTab } from './batch-tab';
import { HealthTab } from './health-tab';
import { ProcessTab } from './process-tab';
import { ResizeTab } from './resize-tab';

export function TabsSection() {
  const [activeTab, setActiveTab] = useState('resize');

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="flex w-full overflow-x-auto no-scrollbar mb-8 bg-muted/50 border border-border/40">
        <TabsTrigger value="resize" className="text-xs sm:text-sm">
          Resize
        </TabsTrigger>
        <TabsTrigger value="advanced" className="text-xs sm:text-sm">
          Advanced
        </TabsTrigger>
        <TabsTrigger value="batch" className="text-xs sm:text-sm">
          Batch
        </TabsTrigger>
        <TabsTrigger value="health" className="text-xs sm:text-sm">
          Health
        </TabsTrigger>
      </TabsList>

      <TabsContent value="resize" className="space-y-6">
        <ResizeTab />
      </TabsContent>

      <TabsContent value="advanced" className="space-y-6">
        <ProcessTab />
      </TabsContent>

      <TabsContent value="batch" className="space-y-6">
        <BatchTab />
      </TabsContent>

      <TabsContent value="health" className="space-y-6">
        <HealthTab />
      </TabsContent>
    </Tabs>
  );
}
