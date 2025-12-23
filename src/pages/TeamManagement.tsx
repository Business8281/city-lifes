import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Team, TeamMember } from '@/types/database';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { useSubscription } from '@/hooks/useSubscription';
import { Trash2, Plus } from 'lucide-react';

export default function TeamManagement() {
    const { user } = useAuth();
    const { isBusiness, plan } = useSubscription();
    const [team, setTeam] = useState<Team | null>(null);
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [inviteEmail, setInviteEmail] = useState('');
    const [isInviteOpen, setIsInviteOpen] = useState(false);

    useEffect(() => {
        if (!user) return;

        const fetchTeamData = async () => {
            try {
                // Fetch team owned by user
                const { data: teamData, error: teamError } = await supabase

                    .from('teams' as any)
                    .select('*')
                    .eq('owner_id', user.id)
                    .single();

                if (teamError && teamError.code !== 'PGRST116') {
                    console.error('Error fetching team:', teamError);
                }

                if (teamData) {
                    const team = teamData as unknown as Team;
                    setTeam(team);

                    // Fetch members
                    const { data: membersData, error: membersError } = await supabase

                        .from('team_members' as any)
                        .select('*, profiles(full_name, email)')
                        .eq('team_id', team.id);

                    if (membersError) {
                        console.error('Error fetching members:', membersError);
                    } else {
                        setMembers((membersData || []) as unknown as TeamMember[]);
                    }
                }
            } catch (error) {
                console.error('Error in fetchTeamData:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTeamData();
    }, [user]);

    const handleCreateTeam = async () => {
        if (!user) return;

        try {
            const { data, error } = await supabase

                .from('teams' as any)
                .insert({
                    owner_id: user.id,
                    name: `${user.user_metadata?.full_name || 'My'} Team`,
                })
                .select()
                .single();

            if (error) throw error;

            setTeam(data as unknown as Team);
            toast.success('Team created successfully');
        } catch (error) {
            console.error('Error creating team:', error);
            toast.error('Failed to create team');
        }
    };

    const handleInviteMember = async () => {
        if (!team || !inviteEmail) return;

        if (members.length >= (plan?.team_member_limit || 0)) {
            toast.error(`Team limit reached (${plan?.team_member_limit} members)`);
            return;
        }

        try {
            const currentTeam = team as unknown as Team;
            const { error } = await supabase

                .from('team_members' as any)
                .insert({
                    team_id: currentTeam.id,
                    email: inviteEmail,
                    role: 'member',
                    status: 'invited',
                });

            if (error) throw error;

            toast.success(`Invitation sent to ${inviteEmail}`);
            setInviteEmail('');
            setIsInviteOpen(false);

            // Refresh members
            const { data: membersData, error: _membersError } = await supabase

                .from('team_members' as any)
                .select('*, profiles(full_name, email)')
                .eq('team_id', currentTeam.id);

            setMembers((membersData || []) as unknown as TeamMember[]);

        } catch (error) {
            console.error('Error inviting member:', error);
            toast.error('Failed to invite member');
        }
    };

    const handleRemoveMember = async (memberId: string) => {
        try {

            const { error } = await supabase
                .from('team_members' as any)
                .delete()
                .eq('id', memberId);

            if (error) throw error;

            setMembers(members.filter(m => m.id !== memberId));
            toast.success('Member removed');
        } catch (error) {
            console.error('Error removing member:', error);
            toast.error('Failed to remove member');
        }
    };

    if (loading) return <div>Loading...</div>;

    if (!isBusiness) {
        return (
            <div className="container mx-auto py-12 px-4 text-center">
                <h1 className="text-3xl font-bold mb-4">Team Management</h1>
                <p className="text-muted-foreground mb-8">Upgrade to the Business plan to manage a team.</p>
                <Button variant="default" onClick={() => window.location.href = '/pricing'}>View Plans</Button>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-8 px-4 space-y-8">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Team Management</h1>
                {team && (
                    <Dialog open={isInviteOpen} onOpenChange={setIsInviteOpen}>
                        <DialogTrigger asChild>
                            <Button>
                                <Plus className="mr-2 h-4 w-4" /> Invite Member
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Invite Team Member</DialogTitle>
                                <DialogDescription>
                                    Send an invitation to join your team. They will receive an email.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="grid grid-cols-4 items-center gap-4">
                                    <Label htmlFor="email" className="text-right">
                                        Email
                                    </Label>
                                    <Input
                                        id="email"
                                        value={inviteEmail}
                                        onChange={(e) => setInviteEmail(e.target.value)}
                                        className="col-span-3"
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <Button onClick={handleInviteMember}>Send Invitation</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                )}
            </div>

            {!team ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Create Your Team</CardTitle>
                        <CardDescription>Start managing your agency or business with a team.</CardDescription>
                    </CardHeader>
                    <CardFooter>
                        <Button onClick={handleCreateTeam}>Create Team</Button>
                    </CardFooter>
                </Card>
            ) : (
                <Card>
                    <CardHeader>
                        <CardTitle>{team.name}</CardTitle>
                        <CardDescription>
                            {members.length} / {plan?.team_member_limit} members
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>User</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Role</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {members.map((member) => (
                                    <TableRow key={member.id}>
                                        <TableCell className="font-medium">
                                            { }
                                            {(member.profiles as any)?.full_name || 'Pending...'}
                                        </TableCell>
                                        <TableCell>{member.email}</TableCell>
                                        <TableCell className="capitalize">{member.role}</TableCell>
                                        <TableCell>
                                            <span className={`px-2 py-1 rounded-full text-xs ${member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {member.status}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button variant="ghost" size="icon" onClick={() => handleRemoveMember(member.id)}>
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {members.length === 0 && (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            No team members yet. Invite someone to get started.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
