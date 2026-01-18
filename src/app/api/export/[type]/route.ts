import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { jsPDF } from "jspdf";
import { format } from "date-fns";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ type: string }> }
) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type } = await params;
    const body = await request.json();
    const { dreamIds, all } = body;

    // Fetch dreams
    const dreams = await prisma.dream.findMany({
      where: {
        userId: session.user.id,
        ...(all ? {} : { id: { in: dreamIds } }),
      },
      include: {
        analysis: true,
      },
      orderBy: { recordedAt: "desc" },
    });

    if (dreams.length === 0) {
      return NextResponse.json({ error: "No dreams found" }, { status: 404 });
    }

    const limits = {
      pdf: 500,    // PDF generation is memory-intensive
      md: 5000,    // Markdown is lightweight
      json: 5000,  // JSON is also lightweight
    };

    const limit = limits[type as keyof typeof limits] || 1000;
    const dreamCount = dreams.length;
    
    if (dreamCount > limit) {
      return NextResponse.json(
        { 
          error: `Export limit exceeded`, 
          message: `Maximum ${limit} dreams for ${type.toUpperCase()} export. You have ${dreamCount} dreams. Please export in batches.`,
          limit,
          count: dreamCount
        },
        { status: 400 }
      );
    }

    switch (type) {
      case "pdf":
        return generatePDF(dreams);
      case "md":
        return generateMarkdown(dreams);
      case "json":
        return generateJSON(dreams);
      default:
        return NextResponse.json(
          { error: "Invalid export type" },
          { status: 400 }
        );
    }
  } catch (error) {
    console.error("Error exporting:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

interface Interpretation {
  jungian?: string;
  freudian?: string;
  actionAdvice?: string;
}

interface DreamExport {
  id: string;
  title: string | null;
  transcript: string;
  recordedAt: Date;
  moodBefore: number | null;
  stressLevel: number | null;
  sleepQuality: number | null;
  analysis: {
    themes: unknown;
    emotions: unknown;
    symbols: unknown;
    people: unknown;
    settings: unknown;
    isNightmare: boolean;
    isLucid: boolean;
    vividness: number;
    summary: string;
    interpretation?: unknown; 
  } | null;
}

function generatePDF(dreams: DreamExport[]) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const maxWidth = pageWidth - margin * 2;
  let y = 20;

  // Title
  doc.setFontSize(24);
  doc.setTextColor(79, 70, 229); // Indigo
  doc.text("Dream Journal", pageWidth / 2, y, { align: "center" });
  y += 15;

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(
    `Exported on ${format(new Date(), "MMMM d, yyyy")}`,
    pageWidth / 2,
    y,
    { align: "center" }
  );
  y += 20;

  dreams.forEach((dream, index) => {
    // Check if we need a new page
    if (y > 250) {
      doc.addPage();
      y = 20;
    }

    // Dream title
    doc.setFontSize(14);
    doc.setTextColor(0);
    doc.text(dream.title || "Untitled Dream", margin, y);
    y += 7;

    // Date
    doc.setFontSize(9);
    doc.setTextColor(100);
    doc.text(format(new Date(dream.recordedAt), "MMMM d, yyyy 'at' h:mm a"), margin, y);
    y += 10;

    // Transcript
    doc.setFontSize(10);
    doc.setTextColor(50);
    const transcriptLines = doc.splitTextToSize(dream.transcript, maxWidth);
    transcriptLines.forEach((line: string) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.text(line, margin, y);
      y += 5;
    });
    y += 5;

    // Analysis summary
    if (dream.analysis?.summary) {
      doc.setFontSize(9);
      doc.setTextColor(79, 70, 229);
      doc.text("Analysis:", margin, y);
      y += 5;
      doc.setTextColor(80);
      const summaryLines = doc.splitTextToSize(dream.analysis.summary, maxWidth);
      summaryLines.forEach((line: string) => {
        if (y > 270) {
          doc.addPage();
          y = 20;
        }
        doc.text(line, margin, y);
        y += 5;
      });
    }

    // Interpretation
    if (dream.analysis?.interpretation) {
      const interp = dream.analysis.interpretation as Interpretation;
      
      if (interp.jungian) {
        y += 5;
        if (y > 250) { doc.addPage(); y = 20; }
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text("Jungian:", margin, y);
        y += 4;
        doc.setTextColor(80);
        const lines = doc.splitTextToSize(interp.jungian, maxWidth);
        lines.forEach((line: string) => {
          if (y > 270) { doc.addPage(); y = 20; }
          doc.text(line, margin, y);
          y += 4;
        });
      }
      
      if (interp.freudian) {
        y += 3;
        if (y > 250) { doc.addPage(); y = 20; }
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text("Freudian:", margin, y);
        y += 4;
        doc.setTextColor(80);
        const lines = doc.splitTextToSize(interp.freudian, maxWidth);
        lines.forEach((line: string) => {
          if (y > 270) { doc.addPage(); y = 20; }
          doc.text(line, margin, y);
          y += 4;
        });
      }
      
      if (interp.actionAdvice) {
        y += 3;
        if (y > 250) { doc.addPage(); y = 20; }
        doc.setFontSize(8);
        doc.setTextColor(100);
        doc.text("Reflection:", margin, y);
        y += 4;
        doc.setTextColor(80);
        const lines = doc.splitTextToSize(interp.actionAdvice, maxWidth);
        lines.forEach((line: string) => {
          if (y > 270) { doc.addPage(); y = 20; }
          doc.text(line, margin, y);
          y += 4;
        });
      }
    }

    // Themes
    if (dream.analysis?.themes) {
      const themes = dream.analysis.themes as string[];
      if (themes.length > 0) {
        y += 3;
        doc.setFontSize(9);
        doc.setTextColor(100);
        doc.text(`Themes: ${themes.join(", ")}`, margin, y);
      }
    }

    y += 15;

    // Separator
    if (index < dreams.length - 1) {
      doc.setDrawColor(200);
      doc.line(margin, y - 5, pageWidth - margin, y - 5);
    }
  });

  const pdfBuffer = doc.output("arraybuffer");
  return new NextResponse(pdfBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": "attachment; filename=dream-journal.pdf",
    },
  });
}

function generateMarkdown(dreams: DreamExport[]) {
  let markdown = `# Dream Journal\n\n`;
  markdown += `*Exported on ${format(new Date(), "MMMM d, yyyy")}*\n\n`;
  markdown += `---\n\n`;

  dreams.forEach((dream) => {
    markdown += `## ${dream.title || "Untitled Dream"}\n\n`;
    markdown += `**Date:** ${format(new Date(dream.recordedAt), "MMMM d, yyyy 'at' h:mm a")}\n\n`;

    if (dream.moodBefore || dream.stressLevel || dream.sleepQuality) {
      markdown += `**Pre-sleep state:**\n`;
      if (dream.moodBefore) markdown += `- Mood: ${dream.moodBefore}/10\n`;
      if (dream.stressLevel) markdown += `- Stress: ${dream.stressLevel}/10\n`;
      if (dream.sleepQuality) markdown += `- Sleep Quality: ${dream.sleepQuality}/10\n`;
      markdown += `\n`;
    }

    markdown += `### Transcript\n\n${dream.transcript}\n\n`;

    if (dream.analysis) {
      markdown += `### Analysis\n\n`;
      markdown += `${dream.analysis.summary}\n\n`;

      // Interpretation
      if (dream.analysis.interpretation) {
        const interp = dream.analysis.interpretation as Interpretation;
        
        if (interp.jungian) {
          markdown += `#### Jungian Perspective\n\n${interp.jungian}\n\n`;
        }
        
        if (interp.freudian) {
          markdown += `#### Freudian Perspective\n\n${interp.freudian}\n\n`;
        }
        
        if (interp.actionAdvice) {
          markdown += `#### Reflection\n\n${interp.actionAdvice}\n\n`;
        }
      }

      const themes = dream.analysis.themes as string[];
      if (themes?.length > 0) {
        markdown += `**Themes:** ${themes.join(", ")}\n\n`;
      }

      const symbols = dream.analysis.symbols as string[];
      if (symbols?.length > 0) {
        markdown += `**Symbols:** ${symbols.join(", ")}\n\n`;
      }

      markdown += `**Type:** ${dream.analysis.isNightmare ? "Nightmare" : dream.analysis.isLucid ? "Lucid Dream" : "Regular Dream"}\n`;
      markdown += `**Vividness:** ${dream.analysis.vividness}/10\n\n`;
    }

    markdown += `---\n\n`;
  });

  return new NextResponse(markdown, {
    headers: {
      "Content-Type": "text/markdown",
      "Content-Disposition": "attachment; filename=dream-journal.md",
    },
  });
}

function generateJSON(dreams: DreamExport[]) {
  const exportData = {
    exportedAt: new Date().toISOString(),
    totalDreams: dreams.length,
    dreams: dreams.map((dream) => ({
      id: dream.id,
      title: dream.title,
      transcript: dream.transcript,
      recordedAt: dream.recordedAt,
      moodBefore: dream.moodBefore,
      stressLevel: dream.stressLevel,
      sleepQuality: dream.sleepQuality,
      analysis: dream.analysis
        ? {
            themes: dream.analysis.themes,
            emotions: dream.analysis.emotions,
            symbols: dream.analysis.symbols,
            people: dream.analysis.people,
            settings: dream.analysis.settings,
            isNightmare: dream.analysis.isNightmare,
            isLucid: dream.analysis.isLucid,
            vividness: dream.analysis.vividness,
            summary: dream.analysis.summary,
            interpretation: dream.analysis.interpretation || null,
          }
        : null,
    })),
  };

  return new NextResponse(JSON.stringify(exportData, null, 2), {
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": "attachment; filename=dream-journal.json",
    },
  });
}

