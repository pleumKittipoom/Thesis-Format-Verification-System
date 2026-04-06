// src/utils/pdf-export.util.ts
import { PDFDocument, PDFName, PDFHexString, rgb, StandardFonts } from 'pdf-lib';
import { Issue } from '../components/shared/thesis-validator/ValidatorIssueList';

/**
 * ฟังก์ชันกลางสำหรับวาดกรอบพิกัดและข้อมูล Error ลงบน PDF
 */
export const generateAnnotatedPdf = async (pdfUrl: string, fileName: string, issues: Issue[]) => {
    const existingPdfBytes = await fetch(pdfUrl).then(res => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    // โหลดฟอนต์สำหรับวาดชื่อ Code
    const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const activeIssues = issues.filter(issue => !issue.isIgnored);

    for (const issue of activeIssues) {
        if (!issue.bbox || issue.bbox.length !== 4) continue;

        const pageIndex = issue.page - 1;
        if (pageIndex < 0 || pageIndex >= pdfDoc.getPageCount()) continue;

        const page = pdfDoc.getPage(pageIndex);
        const { height: pageHeight } = page.getSize();

        const [x0, y0, x1, y1] = issue.bbox;

        // คำนวณพิกัด PDF (0,0 อยู่ซ้ายล่าง)
        const llx = Math.min(x0, x1);
        const lly = pageHeight - Math.max(y0, y1);
        const urx = Math.max(x0, x1);
        const ury = pageHeight - Math.min(y0, y1);

        const colorArr = issue.severity === 'error' ? [0.95, 0.25, 0.36] : [0.98, 0.75, 0.14];
        const rgbColor = issue.severity === 'error' ? rgb(0.95, 0.25, 0.36) : rgb(0.98, 0.75, 0.14);

        // 1. วาดตัวอักษรบอกชื่อ Code
        page.drawText(issue.code, {
            x: llx,
            y: ury + 2,
            size: 9,
            font: font,
            color: rgbColor,
        });

        // 2. สร้าง PDF Annotation (Interactive Comment)
        const annot = pdfDoc.context.obj({
            Type: 'Annot',
            Subtype: 'Square',
            Rect: [llx, lly, urx, ury],
            Contents: PDFHexString.fromText(issue.message),
            T: PDFHexString.fromText(issue.code),
            C: colorArr,
            Border: [0, 0, 1],
        });

        // 3. ฝัง Annotation ลงในหน้า PDF
        let annots = page.node.Annots();
        if (!annots) {
            page.node.set(PDFName.of('Annots'), pdfDoc.context.obj([]));
            annots = page.node.Annots();
        }
        annots!.push(annot);
    }

    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes as any], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);

    // สั่งดาวน์โหลด
    const link = document.createElement('a');
    link.href = url;
    link.download = `annotated_${fileName}`;
    link.target = '_blank'; // ช่วยในบางเบราว์เซอร์
    link.rel = 'noopener noreferrer';
    
    // ต้อง append ลง body ก่อนสั่ง click เสมอ
    document.body.appendChild(link);
    link.click();

    // หน่วงเวลาก่อนเอาออกและลบ URL เพื่อให้ระบบดาวน์โหลดในมือถือทำงานทัน
    setTimeout(() => {
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, 2000);
};