import { notFound } from "next/navigation";
import { LawContent } from "./_components/law-content";
import { VideoSidebar } from "./_components/video-sidebar";
import { getBillById, updateBillSummaries } from "@/app/actions/bills";
import { getBillComments } from "@/app/actions/comments";
import { extractTextFromPdfUrl } from "@/lib/pdf-parser";
import { generateSummaryFromText, generateDidacticSummaryFromText } from "@/lib/gemini-summarizer";

// Temporary video URL - replace with actual video source
const videoSrc =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4";

interface LawDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function LawDetailPage({ params }: LawDetailPageProps) {
  const { id } = await params;

  // Fetch bill data and comments in parallel
  const [billData, comments] = await Promise.all([
    getBillById(id),
    getBillComments(id),
  ]);

  // Handle bill not found
  if (!billData) {
    notFound();
  }

  let summary = billData.summary || "Resumo não disponível.";
  let didacticSummary = billData.didactic_summary || null;
  
  if (billData.pdf_url) {
    const pdfText = await extractTextFromPdfUrl(billData.pdf_url);
    if (pdfText) {
      // Generate both summaries in parallel
      const [geminiSummary, geminiDidacticSummary] = await Promise.all([
        generateSummaryFromText(pdfText),
        generateDidacticSummaryFromText(pdfText),
      ]);
      
      if (geminiSummary) {
        summary = geminiSummary;
      }
      
      if (geminiDidacticSummary) {
        didacticSummary = geminiDidacticSummary;
      }
      
      // Save generated summaries to database (fire and forget)
      if (geminiSummary || geminiDidacticSummary) {
        updateBillSummaries(
          billData.id,
          geminiSummary || summary,
          geminiDidacticSummary || didacticSummary,
        ).catch((error) => {
          console.error("Failed to save summaries to database:", error);
        });
      }
    }
  }

  // Transform bill data to match component props
  const law = {
    id: billData.id,
    title: billData.title,
    status: billData.status,
    breadcrumb: ["Leis", billData.tags[0] || "Geral", billData.code],
    code: billData.code,
    location: billData.location,
    author: billData.author,
    tags: billData.tags,
  };

  const engagementMetrics = {
    comments: billData.comments_count,
    supports: billData.supports_count,
  };

  // Transform comments to match component props
  const transformedComments = comments.map((comment) => ({
    id: comment.id,
    author: {
      name: comment.author.full_name || "Usuário Anônimo",
      avatar: comment.author.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${comment.id}`,
    },
    text: comment.text,
    timestamp: comment.created_at,
    upvotes: comment.upvotes,
    isUpvoted: comment.isUpvoted || false,
    replies: comment.replies.map((reply) => ({
      id: reply.id,
      author: {
        name: reply.author.full_name || "Usuário Anônimo",
        avatar: reply.author.avatar_url || `https://api.dicebear.com/7.x/avataaars/svg?seed=${reply.id}`,
      },
      text: reply.text,
      timestamp: reply.created_at,
      upvotes: reply.upvotes,
      isUpvoted: reply.isUpvoted || false,
    })),
  }));

  // Transform related bills to match component props
  const relatedBills = billData.relatedBills.map((bill) => ({
    id: bill.id,
    title: bill.title,
    code: bill.code,
    status: bill.status,
    tags: bill.tags,
    location: bill.location,
  }));

  const reactionCounts = billData.reactionCounts;
  return (
    <div className="relative min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-6 lg:px-6 lg:py-8">
        {/* Desktop: Inverted Layout (Content 60% LEFT, Video 40% RIGHT) */}
        {/* Mobile: Stack (Video TOP via VideoSidebar mobile section) */}
        <div className="grid gap-8 lg:grid-cols-[3fr_2fr] lg:gap-12">
          {/* Main Content (LEFT on desktop, BELOW video on mobile) */}
          <LawContent
            law={law}
            summary={summary}
            keyPoints={[]}
            details={undefined}
            engagementMetrics={engagementMetrics}
            reactionCounts={reactionCounts}
            relatedBills={relatedBills}
            comments={transformedComments}
            totalComments={engagementMetrics.comments}
          />

          {/* Video Sidebar (RIGHT on desktop, TOP on mobile) */}
          {/* Desktop: Sticky sidebar → PiP on scroll */}
          {/* Mobile: Regular video at top */}
          <VideoSidebar src={videoSrc} />
        </div>
      </div>
    </div>
  );
}
