export interface CertificateData {
    certId: string;
    graduateName: string;
    programTitle: string;
    centerName: string;
    cohortName: string;
    trainingStart: string;
    trainingEnd: string;
    issueDate: string;
    qrDataUrl: string;
}
export declare const generateCertificatePdf: (data: CertificateData) => Promise<Buffer>;
//# sourceMappingURL=pdf.service.d.ts.map