import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";
import { createClient } from 'jsr:@supabase/supabase-js@2';

const app = new Hono();

// Supabase client with service role key
const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
);

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Health check endpoint
app.get("/make-server-19aec8df/health", (c) => {
  return c.json({ status: "ok" });
});

// Sign up endpoint
app.post("/make-server-19aec8df/signup", async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    // Create user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm since email server not configured
      user_metadata: { name }
    });

    if (authError) throw authError;

    // Create user profile in KV store
    const userProfile = {
      id: authData.user.id,
      email,
      name,
      role: 'student',
      onboardingComplete: false,
      credits: 50, // Starting credits
      createdAt: new Date().toISOString()
    };

    await kv.set(`user:${authData.user.id}`, userProfile);

    return c.json({ success: true, user: userProfile });
  } catch (error: any) {
    console.error('Signup error:', error);
    return c.json({ error: error.message }, 400);
  }
});

// Get user profile
app.get("/make-server-19aec8df/user/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    const userProfile = await kv.get(`user:${userId}`);
    
    if (!userProfile) {
      return c.json({ error: 'User not found' }, 404);
    }

    return c.json(userProfile);
  } catch (error: any) {
    console.error('Get user error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Update user profile
app.put("/make-server-19aec8df/user/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    const updates = await c.req.json();
    
    const userProfile = await kv.get(`user:${userId}`);
    if (!userProfile) {
      return c.json({ error: 'User not found' }, 404);
    }

    const updatedProfile = { ...userProfile, ...updates, updatedAt: new Date().toISOString() };
    await kv.set(`user:${userId}`, updatedProfile);

    return c.json(updatedProfile);
  } catch (error: any) {
    console.error('Update user error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get tutors list
app.get("/make-server-19aec8df/tutors", async (c) => {
  try {
    const allUsers = await kv.getByPrefix('user:');
    const tutors = allUsers
      .filter((user: any) => user.role === 'tutor' && user.onboardingComplete)
      .map((tutor: any) => ({
        id: tutor.id,
        name: tutor.name,
        subjects: tutor.subjects || [],
        rating: tutor.rating || 4.5,
        hourlyRate: tutor.hourlyRate || 15,
        verified: true,
        available: tutor.availableTimes?.length > 0,
        avatar: tutor.avatar
      }));

    return c.json(tutors);
  } catch (error: any) {
    console.error('Get tutors error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Create session booking
app.post("/make-server-19aec8df/sessions", async (c) => {
  try {
    const { studentId, tutorId, subject, scheduledTime, duration, credits } = await c.req.json();

    const sessionId = crypto.randomUUID();
    const session = {
      id: sessionId,
      studentId,
      tutorId,
      subject,
      scheduledTime,
      duration,
      credits,
      status: 'scheduled',
      createdAt: new Date().toISOString()
    };

    await kv.set(`session:${sessionId}`, session);
    
    // Add to student's sessions
    const studentSessions = await kv.get(`userSessions:${studentId}`) || [];
    studentSessions.push(sessionId);
    await kv.set(`userSessions:${studentId}`, studentSessions);

    // Add to tutor's sessions
    const tutorSessions = await kv.get(`userSessions:${tutorId}`) || [];
    tutorSessions.push(sessionId);
    await kv.set(`userSessions:${tutorId}`, tutorSessions);

    return c.json(session);
  } catch (error: any) {
    console.error('Create session error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Get user sessions
app.get("/make-server-19aec8df/sessions/:userId", async (c) => {
  try {
    const userId = c.req.param('userId');
    const sessionIds = await kv.get(`userSessions:${userId}`) || [];
    
    const sessions = await Promise.all(
      sessionIds.map((id: string) => kv.get(`session:${id}`))
    );

    return c.json(sessions.filter(Boolean));
  } catch (error: any) {
    console.error('Get sessions error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Q&A endpoints
app.post("/make-server-19aec8df/qa/questions", async (c) => {
  try {
    const { userId, subject, title, content, bounty } = await c.req.json();

    const questionId = crypto.randomUUID();
    const question = {
      id: questionId,
      userId,
      subject,
      title,
      content,
      bounty: bounty || 0,
      answers: [],
      status: 'open',
      createdAt: new Date().toISOString()
    };

    await kv.set(`question:${questionId}`, question);

    return c.json(question);
  } catch (error: any) {
    console.error('Create question error:', error);
    return c.json({ error: error.message }, 500);
  }
});

app.get("/make-server-19aec8df/qa/questions", async (c) => {
  try {
    const questions = await kv.getByPrefix('question:');
    return c.json(questions.sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  } catch (error: any) {
    console.error('Get questions error:', error);
    return c.json({ error: error.message }, 500);
  }
});

// Credits transaction
app.post("/make-server-19aec8df/credits/transfer", async (c) => {
  try {
    const { fromUserId, toUserId, amount, reason } = await c.req.json();

    const fromUser = await kv.get(`user:${fromUserId}`);
    const toUser = await kv.get(`user:${toUserId}`);

    if (!fromUser || !toUser) {
      return c.json({ error: 'User not found' }, 404);
    }

    if (fromUser.credits < amount) {
      return c.json({ error: 'Insufficient credits' }, 400);
    }

    // Update credits
    fromUser.credits -= amount;
    toUser.credits += amount;

    await kv.set(`user:${fromUserId}`, fromUser);
    await kv.set(`user:${toUserId}`, toUser);

    // Log transaction
    const transactionId = crypto.randomUUID();
    const transaction = {
      id: transactionId,
      fromUserId,
      toUserId,
      amount,
      reason,
      timestamp: new Date().toISOString()
    };
    await kv.set(`transaction:${transactionId}`, transaction);

    return c.json({ success: true, transaction });
  } catch (error: any) {
    console.error('Credit transfer error:', error);
    return c.json({ error: error.message }, 500);
  }
});

Deno.serve(app.fetch);