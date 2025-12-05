import { useState, useEffect, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
  defaultDropAnimationSideEffects,
  DropAnimation,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useCRM, useCRMTasks, CRMClient } from '@/hooks/useCRM';
import { useLeads } from '@/hooks/useLeads';
import { useSubscription } from '@/hooks/useSubscription';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  User,
  Phone,
  Mail,
  Calendar,
  Plus,
  Circle,
  Tag,
  Trash2,
  Monitor,
  Laptop,
  GripVertical,
  MoreHorizontal,
  Search,
  Pencil,
  ArrowRight,
  X
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { toast } from 'sonner';

// --- Components ---

interface ClientCardProps {
  client: CRMClient;
  isOverlay?: boolean;
  onClick?: () => void;
  onEdit?: (client: CRMClient) => void;
  onDelete?: (clientId: string) => void;
  onStageChange?: (clientId: string, stage: CRMClient['stage']) => void;
}

const ClientCard = ({ client, isOverlay = false, onClick, onEdit, onDelete, onStageChange }: ClientCardProps) => {
  const {
    setNodeRef,
    attributes,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: client.id,
    data: {
      type: 'Client',
      client,
    },
  });

  const style = {
    transition,
    transform: CSS.Transform.toString(transform),
  };

  if (isDragging) {
    return (
      <div
        ref={setNodeRef}
        style={style}
        className="opacity-30 bg-background/50 border-2 border-primary/20 rounded-xl h-[120px]"
      />
    );
  }

  const stages: CRMClient['stage'][] = ['prospect', 'hot', 'warm', 'cold', 'closed'];

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        "group relative bg-card hover:bg-accent/50 p-4 rounded-xl border shadow-sm transition-all duration-200 cursor-grab active:cursor-grabbing",
        isOverlay && "shadow-xl scale-105 rotate-2 cursor-grabbing bg-card/90 backdrop-blur-sm ring-2 ring-primary/20"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-xs">
            {client.name.substring(0, 2).toUpperCase()}
          </div>
          <div>
            <h4 className="font-semibold text-sm leading-none">{client.name}</h4>
            <span className="text-[10px] text-muted-foreground">{formatDistanceToNow(new Date(client.created_at), { addSuffix: true })}</span>
          </div>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={(e) => e.stopPropagation()} // Prevent card click
            >
              <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem onClick={(e) => {
              e.stopPropagation();
              onEdit?.(client);
            }}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit Details
            </DropdownMenuItem>


            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete?.(client.id);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Client
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Mail className="h-3 w-3" />
          <span className="truncate max-w-[180px]">{client.email}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Phone className="h-3 w-3" />
          <span>{client.phone}</span>
        </div>
      </div>

      {client.leads && (
        <div className="mt-3 pt-3 border-t flex items-center gap-2">
          <Badge variant="secondary" className="text-[10px] h-5 px-1.5 font-normal bg-secondary/50">
            {client.leads.category || 'General'}
          </Badge>
          {client.tags?.map(tag => (
            <Badge key={tag} variant="outline" className="text-[10px] h-5 px-1.5 font-normal">
              {tag}
            </Badge>
          ))}
        </div>
      )}
    </div>
  );
};

const StageColumn = ({
  stage,
  clients,
  id,
  onEdit,
  onDelete,
  onStageChange
}: {
  stage: string;
  clients: CRMClient[];
  id: string;
  onEdit: (client: CRMClient) => void;
  onDelete: (clientId: string) => void;
  onStageChange: (clientId: string, stage: CRMClient['stage']) => void;
}) => {
  const { setNodeRef } = useSortable({
    id: id,
    data: {
      type: 'Column',
      stage,
    },
  });

  const stageColors: Record<string, string> = {
    prospect: 'bg-blue-500/10 text-blue-600 border-blue-200/50',
    hot: 'bg-red-500/10 text-red-600 border-red-200/50',
    warm: 'bg-orange-500/10 text-orange-600 border-orange-200/50',
    cold: 'bg-slate-500/10 text-slate-600 border-slate-200/50',
    closed: 'bg-green-500/10 text-green-600 border-green-200/50',
  };

  return (
    <div className="flex flex-col h-full min-w-[280px] max-w-[320px] bg-muted/30 rounded-2xl border border-border/50 p-3">
      <div className="flex items-center justify-between mb-4 px-1">
        <div className={cn("px-3 py-1 rounded-full text-xs font-semibold border uppercase tracking-wider", stageColors[stage])}>
          {stage}
        </div>
        <span className="text-xs text-muted-foreground font-medium bg-background px-2 py-0.5 rounded-md border shadow-sm">
          {clients.length}
        </span>
      </div>

      <ScrollArea className="flex-1 -mx-1 px-1">
        <div ref={setNodeRef} className="flex flex-col gap-3 min-h-[150px] pb-4">
          <SortableContext items={clients.map(c => c.id)} strategy={verticalListSortingStrategy}>
            {clients.map((client) => (
              <ClientCard
                key={client.id}
                client={client}
                onEdit={onEdit}
                onDelete={onDelete}
                onStageChange={onStageChange}
              />
            ))}
          </SortableContext>
        </div>
      </ScrollArea>
    </div>
  );
};

// --- Main Page ---

const CRM = () => {
  const { clients, loading, updateClientStage, createClient, updateClient, deleteClient } = useCRM();
  const { leads } = useLeads();
  const [leadSearch, setLeadSearch] = useState('');
  const { tasks, createTask, updateTask, deleteTask } = useCRMTasks();
  const { isPro, isBusiness } = useSubscription();
  const [selectedClient, setSelectedClient] = useState<CRMClient | null>(null);
  const [newClientDialog, setNewClientDialog] = useState(false);
  const [editingClient, setEditingClient] = useState<CRMClient | null>(null);
  const [newTaskDialog, setNewTaskDialog] = useState(false);
  const [selectedTaskClientId, setSelectedTaskClientId] = useState<string>('');

  // Desktop Restriction
  const [isDesktop, setIsDesktop] = useState(window.innerWidth >= 1024);
  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth >= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Dnd State
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5, // Prevent accidental drags
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const stages: CRMClient['stage'][] = ['prospect', 'hot', 'warm', 'cold', 'closed'];

  const clientsByStage = useMemo(() => {
    const grouped: Record<string, CRMClient[]> = {};
    stages.forEach(stage => grouped[stage] = []);
    clients.forEach(client => {
      if (grouped[client.stage]) {
        grouped[client.stage].push(client);
      }
    });
    return grouped;
  }, [clients]);

  const onDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const onDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    if (activeId === overId) return;

    // Find the containers
    const activeClient = clients.find(c => c.id === activeId);
    const overClient = clients.find(c => c.id === overId);

    // If dragging over another client, we might want to reorder (visual only for now as we sort by date)
    // But mainly we care about dropping into a column (stage)
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeClient = clients.find(c => c.id === activeId);
    if (!activeClient) return;

    // Check if dropped on a column
    if (stages.includes(overId as any)) {
      if (activeClient.stage !== overId) {
        updateClientStage(activeId, overId as CRMClient['stage']);
      }
      return;
    }

    // Check if dropped on another client
    const overClient = clients.find(c => c.id === overId);
    if (overClient && activeClient.stage !== overClient.stage) {
      updateClientStage(activeId, overClient.stage);
    }
  };

  const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };

  const handleDeleteClient = async (clientId: string) => {
    if (confirm('Are you sure you want to delete this client? This action cannot be undone.')) {
      await deleteClient(clientId);
    }
  };

  if (!isDesktop) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center space-y-6 bg-gradient-to-b from-background to-muted/20">
        <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center animate-pulse ring-4 ring-primary/5">
          <Monitor className="h-12 w-12 text-primary" />
        </div>
        <div className="space-y-2 max-w-md">
          <h1 className="text-2xl font-bold tracking-tight">Desktop Only Feature</h1>
          <p className="text-muted-foreground">
            The CRM Dashboard is optimized for larger screens to provide the best experience for managing your clients and pipelines.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground bg-secondary/50 px-4 py-2 rounded-full border">
          <Laptop className="h-4 w-4" />
          <span>Please access this page on a laptop or desktop computer</span>
        </div>
      </div>
    );
  }

  const activeClient = activeId ? clients.find(c => c.id === activeId) : null;

  return (
    <div className="h-[calc(100vh-4rem)] flex flex-col overflow-hidden bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <div className="flex-none px-8 py-6 border-b bg-background/50 backdrop-blur-sm z-10">
        <div className="flex items-center justify-between max-w-[1600px] mx-auto">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">CRM Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage your client relationships and pipeline</p>
          </div>
          <div className="flex items-center gap-3">
            <Dialog open={newClientDialog} onOpenChange={setNewClientDialog}>
              <DialogTrigger asChild>
                <Button className="shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Client
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add New Client</DialogTitle>
                </DialogHeader>
                <Tabs defaultValue="manual" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="manual">Manual Entry</TabsTrigger>
                    <TabsTrigger value="leads">Import from Leads</TabsTrigger>
                  </TabsList>

                  <TabsContent value="manual">
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      await createClient({
                        lead_id: null,
                        name: formData.get('name') as string,
                        phone: formData.get('phone') as string,
                        email: formData.get('email') as string,
                        stage: 'prospect',
                        tags: []
                      });
                      setNewClientDialog(false);
                    }} className="space-y-4 mt-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" name="phone" type="tel" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" name="email" type="email" required />
                      </div>
                      <Button type="submit" className="w-full">Create Client</Button>
                    </form>
                  </TabsContent>

                  <TabsContent value="leads" className="space-y-4 mt-4">
                    <div className="relative">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Search leads..."
                        value={leadSearch}
                        onChange={(e) => setLeadSearch(e.target.value)}
                        className="pl-8"
                      />
                    </div>
                    <ScrollArea className="h-[300px] border rounded-md p-2">
                      <div className="space-y-2">
                        {leads
                          .filter(lead =>
                            lead.name.toLowerCase().includes(leadSearch.toLowerCase()) ||
                            lead.email?.toLowerCase().includes(leadSearch.toLowerCase()) ||
                            lead.phone.includes(leadSearch)
                          )
                          .map((lead) => (
                            <div key={lead.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                              <div className="space-y-1">
                                <p className="font-medium text-sm">{lead.name}</p>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <span>{lead.phone}</span>
                                  {lead.email && <span>• {lead.email}</span>}
                                </div>
                              </div>
                              <Button
                                size="sm"
                                onClick={async () => {
                                  await createClient({
                                    lead_id: lead.id,
                                    name: lead.name,
                                    phone: lead.phone,
                                    email: lead.email || '',
                                    stage: 'prospect',
                                    tags: ['imported-lead']
                                  });
                                  setNewClientDialog(false);
                                }}
                              >
                                Add
                              </Button>
                            </div>
                          ))}
                        {leads.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground text-sm">
                            No leads found
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>

            {/* Edit Client Dialog */}
            <Dialog open={!!editingClient} onOpenChange={(open) => !open && setEditingClient(null)}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Edit Client</DialogTitle>
                </DialogHeader>
                {editingClient && (
                  <form onSubmit={async (e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    await updateClient(editingClient.id, {
                      name: formData.get('name') as string,
                      phone: formData.get('phone') as string,
                      email: formData.get('email') as string,
                    });
                    setEditingClient(null);
                  }} className="space-y-4 mt-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-name">Name</Label>
                      <Input id="edit-name" name="name" defaultValue={editingClient.name} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-phone">Phone</Label>
                      <Input id="edit-phone" name="phone" type="tel" defaultValue={editingClient.phone} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-email">Email</Label>
                      <Input id="edit-email" name="email" type="email" defaultValue={editingClient.email} required />
                    </div>
                    <Button type="submit" className="w-full">Update Client</Button>
                  </form>
                )}
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex gap-6 p-6 max-w-[1600px] mx-auto">

          {/* Kanban Board */}
          <div className="flex-1 overflow-x-auto pb-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={onDragStart}
              onDragOver={onDragOver}
              onDragEnd={onDragEnd}
            >
              <div className="flex h-full gap-4 min-w-max">
                {stages.map((stage) => (
                  <StageColumn
                    key={stage}
                    id={stage}
                    stage={stage}
                    clients={clientsByStage[stage]}
                    onEdit={setEditingClient}
                    onDelete={handleDeleteClient}
                    onStageChange={updateClientStage}
                  />
                ))}
              </div>
              <DragOverlay dropAnimation={dropAnimation}>
                {activeClient ? <ClientCard client={activeClient} isOverlay /> : null}
              </DragOverlay>
            </DndContext>
          </div>

          {/* Sidebar (Tasks) */}
          <div className="w-[350px] flex-none flex flex-col gap-6 border-l pl-6 bg-background/30">
            <Card className={cn("flex-1 flex flex-col shadow-none border-0 bg-transparent", !isPro && !isBusiness && "opacity-75 relative overflow-hidden")}>
              {!isPro && !isBusiness && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-[1px] z-10 flex flex-col items-center justify-center text-center p-4 rounded-xl border border-dashed">
                  <h3 className="font-semibold mb-2">Pro Feature</h3>
                  <p className="text-sm text-muted-foreground mb-4">Upgrade to Pro to manage tasks and reminders.</p>
                  <Button size="sm" onClick={() => window.location.href = '/pricing'}>Upgrade Now</Button>
                </div>
              )}
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Tasks</h3>
                <Dialog open={newTaskDialog} onOpenChange={setNewTaskDialog}>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" className="h-8 w-8 p-0" disabled={!isPro && !isBusiness}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Task</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={async (e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const clientId = selectedTaskClientId;
                      if (clientId) {
                        await createTask({
                          client_id: clientId,
                          title: formData.get('title') as string,
                          description: formData.get('description') as string || null,
                          due_date: formData.get('due_date') as string || null,
                          status: 'pending'
                        });
                        setNewTaskDialog(false);
                        setSelectedTaskClientId('');
                      }
                    }} className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="client">Select Client *</Label>
                        <Select
                          value={selectedTaskClientId}
                          onValueChange={setSelectedTaskClientId}
                          required
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose a client" />
                          </SelectTrigger>
                          <SelectContent>
                            {clients.map((client) => (
                              <SelectItem key={client.id} value={client.id}>
                                {client.name} - {client.email}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="title">Task Title</Label>
                        <Input id="title" name="title" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea id="description" name="description" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="due_date">Due Date</Label>
                        <Input id="due_date" name="due_date" type="datetime-local" />
                      </div>
                      <Button type="submit" className="w-full">Create Task</Button>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <ScrollArea className="flex-1 -mx-4 px-4">
                <div className="space-y-3 pb-4">
                  {tasks.filter(t => t.status === 'pending').length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground border-2 border-dashed rounded-xl">
                      <Circle className="h-8 w-8 mb-2 opacity-20" />
                      <p className="text-sm">No pending tasks</p>
                    </div>
                  ) : (
                    tasks.filter(t => t.status === 'pending').map((task) => (
                      <div
                        key={task.id}
                        className="group flex items-start gap-3 p-3 bg-card border rounded-xl hover:shadow-md transition-all duration-200"
                      >
                        <button
                          onClick={() => updateTask(task.id, { status: 'completed' })}
                          className="mt-0.5 text-muted-foreground hover:text-primary transition-colors"
                        >
                          <Circle className="h-4 w-4" />
                        </button>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium leading-none mb-1.5">{task.title}</p>
                          {task.description && (
                            <p className="text-xs text-muted-foreground line-clamp-2 mb-1.5">{task.description}</p>
                          )}
                          <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                            {task.due_date && (
                              <span className={cn(new Date(task.due_date) < new Date() && "text-destructive font-medium")}>
                                {formatDistanceToNow(new Date(task.due_date), { addSuffix: true })}
                              </span>
                            )}
                          </div>
                        </div>
                        <button
                          onClick={() => deleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CRM;
