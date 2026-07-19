import { prisma } from "../lib/prisma.js";

export async function getApplications(req, res) {
  try {
    const applications = await prisma.application.findMany({
      where: { userId: req.userId },
      orderBy: { appliedAt: "desc" },
    });
    res.json(applications);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error in the server" });
  }
}

export async function getApplicationById(req, res) {
  try {
    const application = await prisma.application.findFirst({
      where: { id: req.params.id, userId: req.userId },
    });
    if (!application) {
      return res.status(404).json({ error: "Application not found" });
    }
    res.json(application);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error in the server" });
  }
}

export async function createApplication(req, res) {
  try {
    const { company, role, status, jobUrl, notes } = req.body;
    if (!company || !role) {
      return res.status(400).json({ error: "Company and role are required" });
    }

    const application = await prisma.application.create({
      data: { company, role, status, jobUrl, notes, userId: req.userId },
    });
    res.status(201).json(application);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error in the server" });
  }
}

export async function updateApplication(req, res) {
  try {
    const { id } = req.params;
    const existing = await prisma.application.findFirst({
      where: { id, userId: req.userId },
    });
    if (!existing) {
      return res.status(404).json({ error: "Application not found" });
    }

    const { company, role, status, jobUrl, notes } = req.body;
    const updated = await prisma.application.update({
      where: { id },
      data: { company, role, status, jobUrl, notes },
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error in the server" });
  }
}

export async function deleteApplication(req, res) {
  try {
    const { id } = req.params;
    const existing = await prisma.application.findFirst({
      where: { id, userId: req.userId },
    });
    if (!existing) {
      return res.status(404).json({ error: "Application not found" });
    }

    await prisma.application.delete({ where: { id } });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error in the server" });
  }
}