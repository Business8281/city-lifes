import { useState } from 'react';
import { useCRM, useCRMTasks, CRMClient } from '@/hooks/useCRM';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { 
  User, 
  Phone, 
  Mail, 
  Calendar,
  Plus,
  CheckCircle2,
  Circle
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const CRM = () => {
  const { clients, loading, updateClientStage, createClient } = useCRM();
  const { tasks, createTask, updateTask } = useCRMTasks();
  const [selectedClient, setSelectedClient] = useState<CRMClient | null>(null);
  const [newClientDialog, setNewClientDialog] = useState(false);
  const [newTaskDialog, setNewTaskDialog] = useState(false);

  const stages: CRMClient['stage'][] = ['prospect', 'hot', 'warm', 'cold', 'closed'];

  const getClientsByStage = (stage: CRMClient['stage']) => {
    return clients.filter(client => client.stage === stage);
  };

  const getStageBadge = (stage: CRMClient['stage']) => {
    const colors: Record<CRMClient['stage'], string> = {
      prospect: 'bg-blue-500',
      hot: 'bg-red-500',
      warm: 'bg-orange-500',
      cold: 'bg-gray-500',
      closed: 'bg-green-500'
    };
    return <Badge className={colors[stage]}>{stage}</Badge>;
  };

  const pendingTasks = tasks.filter(t => t.status === 'pending');

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">CRM Dashboard</h1>
          <p className="text-muted-foreground">Manage your client relationships</p>
        </div>
        <Dialog open={newClientDialog} onOpenChange={setNewClientDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Client
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Client</DialogTitle>
            </DialogHeader>
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
            }} className="space-y-4">
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
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Pipeline Kanban */}
        <div className="lg:col-span-3">
          <Card>
            <CardHeader>
              <CardTitle>Sales Pipeline</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4">
                {stages.map((stage) => (
                  <div key={stage} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="font-semibold capitalize">{stage}</h3>
                      <Badge variant="secondary">{getClientsByStage(stage).length}</Badge>
                    </div>
                    <ScrollArea className="h-[600px]">
                      <div className="space-y-2 pr-4">
                        {getClientsByStage(stage).map((client) => (
                          <Card
                            key={client.id}
                            className="cursor-pointer hover:shadow-md transition-shadow"
                            onClick={() => setSelectedClient(client)}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-start gap-2 mb-2">
                                <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                                <div className="flex-1 min-w-0">
                                  <p className="font-medium text-sm truncate">{client.name}</p>
                                  <p className="text-xs text-muted-foreground truncate">{client.email}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Calendar className="h-3 w-3" />
                                <span>{formatDistanceToNow(new Date(client.created_at), { addSuffix: true })}</span>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tasks Sidebar */}
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Tasks</CardTitle>
              <Dialog open={newTaskDialog} onOpenChange={setNewTaskDialog}>
                <DialogTrigger asChild>
                  <Button size="sm" variant="outline">
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
                    if (selectedClient) {
                      await createTask({
                        client_id: selectedClient.id,
                        title: formData.get('title') as string,
                        description: formData.get('description') as string || null,
                        due_date: formData.get('due_date') as string || null,
                        status: 'pending'
                      });
                      setNewTaskDialog(false);
                    }
                  }} className="space-y-4">
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
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[300px]">
                <div className="space-y-2">
                  {pendingTasks.length === 0 ? (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      No pending tasks
                    </p>
                  ) : (
                    pendingTasks.map((task) => (
                      <div
                        key={task.id}
                        className="flex items-start gap-2 p-3 border rounded-lg hover:bg-accent cursor-pointer"
                        onClick={() => updateTask(task.id, { status: 'completed' })}
                      >
                        <Circle className="h-4 w-4 text-muted-foreground mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{task.title}</p>
                          {task.due_date && (
                            <p className="text-xs text-muted-foreground">
                              Due {formatDistanceToNow(new Date(task.due_date), { addSuffix: true })}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          {/* Selected Client Details */}
          {selectedClient && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Client Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="font-semibold text-lg">{selectedClient.name}</p>
                  {getStageBadge(selectedClient.stage)}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{selectedClient.phone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span className="truncate">{selectedClient.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{formatDistanceToNow(new Date(selectedClient.created_at), { addSuffix: true })}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Move to Stage</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {stages.map((stage) => (
                      <Button
                        key={stage}
                        size="sm"
                        variant={selectedClient.stage === stage ? 'default' : 'outline'}
                        onClick={() => updateClientStage(selectedClient.id, stage)}
                        className="capitalize"
                      >
                        {stage}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default CRM;
