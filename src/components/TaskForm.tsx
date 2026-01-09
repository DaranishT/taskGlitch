import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Grid,
  MenuItem,
  Stack,
  Alert
} from '@mui/material';
import { Task, Priority, Status } from '@/types';

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  // FIX: We relax the type here so it doesn't ask for createdAt/completedAt
  onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'completedAt'> & { id?: string }) => void;
  existingTitles: string[];
  initial: Task | null;
}

export default function TaskForm({ open, onClose, onSubmit, existingTitles, initial }: TaskFormProps) {
  const [title, setTitle] = useState('');
  const [revenue, setRevenue] = useState<number | string>('');
  const [timeTaken, setTimeTaken] = useState<number | string>('');
  const [priority, setPriority] = useState<Priority>('Medium');
  const [status, setStatus] = useState<Status>('Todo');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (open) {
      if (initial) {
        setTitle(initial.title);
        setRevenue(initial.revenue);
        setTimeTaken(initial.timeTaken);
        setPriority(initial.priority);
        setStatus(initial.status);
        setNotes(initial.notes || '');
      } else {
        setTitle('');
        setRevenue('');
        setTimeTaken('');
        setPriority('Medium');
        setStatus('Todo');
        setNotes('');
      }
      setError(null);
    }
  }, [open, initial]);

  const handleSubmit = () => {
    if (!title.trim()) {
      setError('Title is required');
      return;
    }
    
    if (existingTitles.includes(title.trim()) && (!initial || initial.title !== title)) {
      setError('A task with this title already exists');
      return;
    }

    if (revenue === '' || Number(revenue) < 0) {
      setError('Valid revenue is required');
      return;
    }
    
    if (timeTaken === '' || Number(timeTaken) <= 0) {
      setError('Time taken must be greater than 0');
      return;
    }

    const payload = {
      title: title.trim(),
      revenue: Number(revenue),
      timeTaken: Number(timeTaken),
      priority,
      status,
      notes: notes.trim() || undefined,
    };

    if (initial) {
      // This line will now work because onSubmit expects relaxed types
      onSubmit({ ...payload, id: initial.id });
    } else {
      onSubmit(payload);
    }
    
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{initial ? 'Edit Task' : 'Add New Task'}</DialogTitle>
      <DialogContent dividers>
        <Stack spacing={2} pt={1}>
          {error && <Alert severity="error">{error}</Alert>}
          <TextField label="Task Title" fullWidth value={title} onChange={(e) => setTitle(e.target.value)} autoFocus />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField label="Revenue ($)" type="number" fullWidth value={revenue} onChange={(e) => setRevenue(e.target.value)} />
            </Grid>
            <Grid item xs={6}>
              <TextField label="Time Taken (hrs)" type="number" fullWidth value={timeTaken} onChange={(e) => setTimeTaken(e.target.value)} />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField select label="Priority" fullWidth value={priority} onChange={(e) => setPriority(e.target.value as Priority)}>
                <MenuItem value="High">High</MenuItem>
                <MenuItem value="Medium">Medium</MenuItem>
                <MenuItem value="Low">Low</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={6}>
              <TextField select label="Status" fullWidth value={status} onChange={(e) => setStatus(e.target.value as Status)}>
                <MenuItem value="Todo">Todo</MenuItem>
                <MenuItem value="In Progress">In Progress</MenuItem>
                <MenuItem value="Done">Done</MenuItem>
              </TextField>
            </Grid>
          </Grid>
          <TextField label="Notes" multiline rows={3} fullWidth value={notes} onChange={(e) => setNotes(e.target.value)} />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">{initial ? 'Save Changes' : 'Create Task'}</Button>
      </DialogActions>
    </Dialog>
  );
}