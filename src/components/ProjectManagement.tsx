import React, { useState } from 'react';
import { Briefcase, MoreVertical, Plus, CreditCard, Users, ExternalLink, Edit2, Trash2 } from 'lucide-react';
import { useAppStore } from '../hooks/useAppStore';
import { Project } from '../types';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';

export default function ProjectManagement() {
  const { projects } = useAppStore();
  
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Project Management</h2>
          <p className="text-slate-500 dark:text-slate-400">Organize and track card distribution by community groups.</p>
        </div>
        <Button className="flex items-center gap-2 px-4 py-2 bg-slate-900 dark:bg-slate-50 text-white dark:text-slate-900 rounded-xl font-medium hover:bg-slate-800 dark:hover:bg-slate-200 shadow-lg transition-all">
          <Plus className="w-4 h-4" />
          Create Project
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className="flex items-start justify-between mb-6">
               <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                 <Briefcase className="w-6 h-6" />
               </div>
               <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem className="gap-2">
                    <Edit2 size={14} /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 text-red-600">
                    <Trash2 size={14} /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
               </DropdownMenu>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{project.name}</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{project.description}</p>
              <Badge variant={project.status === 'Active' ? 'default' : 'secondary'} className="mt-3">
                {project.status}
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-slate-100 dark:border-slate-800">
               <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <CreditCard className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">Cards</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{project.totalCards}</p>
               </div>
               <div className="space-y-1">
                  <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
                    <Users className="w-3.5 h-3.5" />
                    <span className="text-xs font-medium">Linked</span>
                  </div>
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">{project.linkedCards}</p>
               </div>
            </div>

            <div className="mt-6">
              <div className="flex justify-between text-xs font-bold text-slate-400 dark:text-slate-500 mb-1.5 uppercase">
                 <span>Linkage Efficiency</span>
                 <span>{Math.round((project.linkedCards / project.totalCards) * 100)}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-blue-500 rounded-full transition-all duration-1000" 
                  style={{ width: `${(project.linkedCards / project.totalCards) * 100}%` }}
                ></div>
              </div>
            </div>

            <button className="mt-6 w-full py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all flex items-center justify-center gap-2">
              View Project Details
              <ExternalLink className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        <button className="bg-slate-50 dark:bg-slate-900/50 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-800 p-6 flex flex-col items-center justify-center text-center group hover:bg-white dark:hover:bg-slate-900 hover:border-blue-300 dark:hover:border-blue-700 transition-all min-h-[300px]">
           <div className="w-12 h-12 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:border-blue-200 transition-all mb-4">
              <Plus className="w-6 h-6" />
           </div>
           <p className="font-bold text-slate-600 dark:text-slate-400 group-hover:text-blue-600 dark:group-hover:text-blue-400">Add New Project</p>
           <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">Start organizing a new community or merchant group</p>
        </button>
      </div>
    </div>
  );
}