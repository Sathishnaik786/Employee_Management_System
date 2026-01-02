import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  SearchIcon, 
  PlusIcon, 
  MoreHorizontalIcon,
  CalendarIcon,
  UserIcon,
  FileTextIcon,
  CheckCircleIcon
} from 'lucide-react';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { projectsApi } from '@/services/api';
import { Project, Employee } from '@/types';
import ProjectStatusBadge from '@/components/common/ProjectStatusBadge';
import ProjectForm from '@/components/forms/ProjectForm';
import { employeesApi } from '@/services/api';

const ProjectsPage: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, isLoading: authLoading } = useAuth();

  // Fetch projects
  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await projectsApi.getAll({
        page: currentPage,
        limit: itemsPerPage,
        search: searchTerm,
      });
      setProjects(response.data);
      setTotalPages(response.meta.totalPages);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch projects',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  // Fetch employees
  const fetchEmployees = async () => {
    try {
      const response = await employeesApi.getAll();
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch employees',
        variant: 'destructive',
      });
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchProjects();
      fetchEmployees();
    }
  }, [currentPage, searchTerm, authLoading, user]);

  const handleCreateProject = async (data: any) => {
    try {
      await projectsApi.create(data);
      toast({
        title: 'Success',
        description: 'Project created successfully',
      });
      setIsCreateDialogOpen(false);
      fetchProjects();
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: 'Error',
        description: 'Failed to create project',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateProject = async (data: any) => {
    if (!editingProject) return;
    
    try {
      await projectsApi.update(editingProject.id, data);
      toast({
        title: 'Success',
        description: 'Project updated successfully',
      });
      setIsEditDialogOpen(false);
      setEditingProject(null);
      fetchProjects();
    } catch (error) {
      console.error('Error updating project:', error);
      toast({
        title: 'Error',
        description: 'Failed to update project',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this project?')) {
      return;
    }

    try {
      await projectsApi.delete(id);
      toast({
        title: 'Success',
        description: 'Project deleted successfully',
      });
      fetchProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      toast({
        title: 'Error',
        description: 'Failed to delete project',
        variant: 'destructive',
      });
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setIsEditDialogOpen(true);
  };

  const handleViewProject = (id: string) => {
    navigate(`/app/projects/${id}`);
  };

  const filteredProjects = projects.filter(project =>
    project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    project.project_type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {authLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
              <p className="text-gray-500">Manage your organization's projects</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Search projects..."
                  className="pl-8 w-full sm:w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button>
                    <PlusIcon className="h-4 w-4 mr-2" />
                    Create Project
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Create Project</DialogTitle>
                  </DialogHeader>
                  <ProjectForm
                    onSubmit={handleCreateProject}
                    onCancel={() => setIsCreateDialogOpen(false)}
                    employees={employees}
                  />
                </DialogContent>
              </Dialog>
            </div>
          </div>

      <Card>
        <CardHeader>
          <CardTitle>Project List</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-full">
                <TableHeader>
                  <TableRow>
                    <TableHead className="whitespace-nowrap">Project</TableHead>
                    <TableHead className="whitespace-nowrap">Type</TableHead>
                    <TableHead className="whitespace-nowrap">Manager</TableHead>
                    <TableHead className="whitespace-nowrap">Status</TableHead>
                    <TableHead className="whitespace-nowrap">Start Date</TableHead>
                    <TableHead className="whitespace-nowrap">End Date</TableHead>
                    <TableHead className="whitespace-nowrap">Members</TableHead>
                    <TableHead className="whitespace-nowrap">Progress</TableHead>
                    <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProjects.length > 0 ? (
                    filteredProjects.map((project) => (
                      <TableRow key={project.id}>
                        <TableCell className="font-medium min-w-[150px]">
                          <div className="flex flex-col">
                            <span className="font-semibold">{project.name}</span>
                            {project.description && (
                              <span className="text-sm text-gray-500 truncate max-w-[120px] sm:max-w-xs">
                                {project.description}
                              </span>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          <span className="text-sm font-medium">
                            {project.project_type.replace('_', ' ')}
                          </span>
                        </TableCell>
                        <TableCell className="min-w-[120px]">
                          <div className="flex items-center">
                            <UserIcon className="h-4 w-4 mr-1.5" />
                            <span>
                              {project.manager?.firstName} {project.manager?.lastName}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          <ProjectStatusBadge status={project.status} />
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          {project.start_date ? format(new Date(project.start_date), 'MMM dd, yyyy') : 'N/A'}
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          {project.end_date ? format(new Date(project.end_date), 'MMM dd, yyyy') : 'N/A'}
                        </TableCell>
                        <TableCell className="min-w-[80px]">
                          <div className="flex items-center">
                            <UserIcon className="h-4 w-4 mr-1.5" />
                            <span>{project.project_members.length}</span>
                          </div>
                        </TableCell>
                        <TableCell className="min-w-[100px]">
                          <div className="flex items-center">
                            <CheckCircleIcon className="h-4 w-4 mr-1.5" />
                            <span>
                              {project.project_tasks?.filter(t => t.status === 'DONE').length || 0}/{project.project_tasks?.length || 0}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right min-w-[80px]">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <MoreHorizontalIcon className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewProject(project.id)}>
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditProject(project)}>
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                onClick={() => handleDeleteProject(project.id)}
                                className="text-red-600"
                              >
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                        No projects found
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex justify-center items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <span className="px-2">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
          </DialogHeader>
          {editingProject && (
            <ProjectForm
              onSubmit={handleUpdateProject}
              onCancel={() => setIsEditDialogOpen(false)}
              initialData={{
                name: editingProject.name,
                description: editingProject.description,
                project_type: editingProject.project_type,
                status: editingProject.status,
                start_date: editingProject.start_date,
                end_date: editingProject.end_date,
                manager_id: editingProject.manager_id,
                client_id: editingProject.client_id,
              }}
              employees={employees}
            />
          )}
        </DialogContent>
      </Dialog>
      </>  // Closing the fragment
    )}  
    </div>
  );
};

export default ProjectsPage;