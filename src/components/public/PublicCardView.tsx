import React from 'react';
import { Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { toast } from 'sonner';
import { FrontPlate } from '@/components/card/FrontPlate';
import { BackPlate } from '@/components/card/BackPlate';
import { BrandIcon } from '@/components/ui/BrandIcon';
import { CardData } from '@/types';

interface PublicCardViewProps {
  card: CardData;
}

export const PublicCardView: React.FC<PublicCardViewProps> = ({ card }) => {
  const [isFlipped, setIsFlipped] = React.useState(false);
  const [isExporting, setIsExporting] = React.useState(false);

  const handleExport = async () => {
      const frontFace = document.getElementById('public-export-front');
      const backFace = document.getElementById('public-export-back');
      
      if (!frontFace || !backFace) {
          toast.error("Export elements not found.");
          return;
      }
      
      setIsExporting(true);
      const toastId = toast.loading("Generating High-Res PDF...");

      try {
           // Scale 4 for high quality print (approx 300dpi)
          const frontCanvas = await html2canvas(frontFace, { scale: 4, useCORS: true, backgroundColor: '#ffffff' });
          const backCanvas = await html2canvas(backFace, { scale: 4, useCORS: true, backgroundColor: '#ffffff' });

          const pdf = new jsPDF('p', 'mm', [139.7, 215.9]); // 5.5 x 8.5 inches
          const width = pdf.internal.pageSize.getWidth();
          const height = pdf.internal.pageSize.getHeight();

          // Page 1: Front
          pdf.addImage(frontCanvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, width, height);
          
          // Page 2: Back
          pdf.addPage();
          pdf.addImage(backCanvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, width, height);

          // Filename
          const safeName = (card.name || 'composite-card').replace(/[^a-z0-9]/gi, '_').toLowerCase();
          pdf.save(`${safeName}.pdf`);
          toast.success("PDF Downloaded", { id: toastId });
      } catch (e) {
          console.error("PDF Fail", e);
          toast.error("Failed to generate PDF", { id: toastId });
      } finally {
          setIsExporting(false);
      }
  };

  return (
    <div className="min-h-screen bg-zinc-50 py-16 px-6 flex flex-col items-center space-y-16">
       <div className="flex flex-col items-center space-y-2">
         <BrandIcon size={40} />
         <h1 className="text-2xl font-serif tracking-[0.3em] uppercase">Pose & Poise</h1>
       </div>
       <div className="aspect-[5.5/8.5] h-[85vh] relative perspective-1000 animate-in zoom-in-50 duration-500">
        <div className={`relative w-full h-full transition-all duration-700 preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
            {/* FRONT */}
            <div className="absolute inset-0 backface-hidden shadow-2xl bg-white">
                <FrontPlate layout={card.frontLayout} images={card.images} profile={card.profile} />
            </div>

            {/* BACK */}
            <div className="absolute inset-0 backface-hidden rotate-y-180 bg-white shadow-2xl">
                <BackPlate layout={card.backLayout} images={card.images} profile={card.profile} isPublic={true} />
            </div>
        </div>

        {/* Action Buttons */}
        <div className="absolute bottom-4 right-4 z-10 flex gap-2">
           <button 
             onClick={handleExport}
             disabled={isExporting}
             className="bg-white text-black px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-full shadow-lg hover:bg-zinc-100 transition-colors flex items-center gap-2"
           >
              <Download size={14} /> {isExporting ? 'Exporting...' : 'PDF'}
           </button>
           <button className="bg-black text-white px-4 py-2 text-xs font-bold uppercase tracking-widest rounded-full shadow-lg hover:scale-105 transition-transform"
             onClick={() => setIsFlipped(!isFlipped)}
           >
              Flip Card
           </button>
        </div>
      </div>
      <style>{`
        .perspective-1000 { perspective: 1000px; }
        .preserve-3d { transform-style: preserve-3d; }
        .backface-hidden { backface-visibility: hidden; }
        .rotate-y-180 { transform: rotateY(180deg); }
      `}</style>
       <footer className="py-20 text-center opacity-20">
         <BrandIcon size={40} className="mx-auto" />
       </footer>

        {/* Hidden Export Container */}
        <div className="fixed top-0 left-0 pointer-events-none opacity-0 overflow-hidden" style={{ zIndex: -50 }}>
            {/* 5.5 x 8.5 inches at 96 DPI is approx 528 x 816 px. 
                For high res export, we rely on the component rendering cleanly. 
                We use a fixed container size to ensure layout consistency. */}
            <div id="public-export-front" style={{ width: '528px', height: '816px' }}>
                <FrontPlate layout={card.frontLayout} images={card.images} profile={card.profile} />
            </div>
            <div id="public-export-back" style={{ width: '528px', height: '816px' }}>
                <BackPlate layout={card.backLayout} images={card.images} profile={card.profile} isPublic={true} />
            </div>
        </div>
    </div>
  );
};
