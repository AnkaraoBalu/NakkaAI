export default function AuthCode({ activeFile }) {
  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="auth.ts code preview"
      id="file-content-auth"
      className={
        "flex-1 min-h-0 max-h-[320px] md:max-h-none p-2 sm:p-3 leading-[22px] overflow-auto [&_span]:whitespace-pre text-[12px] bg-surface-container-lowest select-text font-mono transition-opacity duration-150" +
        (activeFile === "auth" ? "" : " hidden")
      }
    >
      <div className="w-max min-w-full">
        <div className="flex text-outline select-none">
          <span className="w-11 shrink-0 text-right pr-3 opacity-40">1</span>
          <span className="text-on-surface-variant">
            {"import { Request, Response, NextFunction } from 'express';"}
          </span>
        </div>
        <div className="flex text-outline select-none">
          <span className="w-11 shrink-0 text-right pr-3 opacity-40">2</span>
          <span className="text-on-surface-variant">
            {"import { verifyJwt } from '../services/crypto';"}
          </span>
        </div>
        <div className="flex text-outline select-none">
          <span className="w-11 shrink-0 text-right pr-3 opacity-40">3</span>
          <span></span>
        </div>

        <div className="flex bg-error-container/20 text-error">
          <span className="w-11 shrink-0 text-right pr-3 text-error/60 select-none">
            - 4
          </span>
          <span className="">
            {"export async function verifyToken(req: any, res: any) {"}
          </span>
        </div>

        <div className="flex bg-secondary-container/20 text-secondary">
          <span className="w-11 shrink-0 text-right pr-3 text-secondary/70 select-none">
            + 4
          </span>
          <span className="">export async function verifyToken(</span>
        </div>
        <div className="flex bg-secondary-container/20 text-secondary">
          <span className="w-11 shrink-0 text-right pr-3 text-secondary/70 select-none">
            + 5
          </span>
          <span className="">{"  req: AuthenticatedRequest,"}</span>
        </div>
        <div className="flex bg-secondary-container/20 text-secondary">
          <span className="w-11 shrink-0 text-right pr-3 text-secondary/70 select-none">
            + 6
          </span>
          <span className="">{"  res: Response,"}</span>
        </div>
        <div className="flex bg-secondary-container/20 text-secondary">
          <span className="w-11 shrink-0 text-right pr-3 text-secondary/70 select-none">
            + 7
          </span>
          <span className="">{"  next: NextFunction"}</span>
        </div>
        <div className="flex bg-secondary-container/20 text-secondary">
          <span className="w-11 shrink-0 text-right pr-3 text-secondary/70 select-none">
            + 8
          </span>
          <span className="">{"): Promise<void> {"}</span>
        </div>
        <div className="flex text-outline select-none">
          <span className="w-11 shrink-0 text-right pr-3 opacity-40">9</span>
          <span className="text-on-surface-variant">
            {"  const authHeader = req.headers.authorization;"}
          </span>
        </div>
        <div className="flex text-outline select-none">
          <span className="w-11 shrink-0 text-right pr-3 opacity-40">10</span>
          <span className="text-on-surface-variant">
            {"  if (!authHeader?.startsWith('Bearer ')) {"}
          </span>
        </div>
        <div className="flex text-outline select-none">
          <span className="w-11 shrink-0 text-right pr-3 opacity-40">11</span>
          <span className="text-on-surface-variant">
            {"    return res.status(401).json({ error: 'Unauthorized' });"}
          </span>
        </div>
        <div className="flex bg-secondary-container/20 text-secondary">
          <span className="w-11 shrink-0 text-right pr-3 text-secondary/70 select-none">
            + 12
          </span>
          <span className="">{"  }"}</span>
        </div>
        <div className="flex bg-secondary-container/20 text-secondary">
          <span className="w-11 shrink-0 text-right pr-3 text-secondary/70 select-none">
            + 13
          </span>
          <span className="">
            {"  const token = authHeader.split(' ')[1];"}
          </span>
        </div>
        <div className="flex bg-secondary-container/20 text-secondary">
          <span className="w-11 shrink-0 text-right pr-3 text-secondary/70 select-none">
            + 14
          </span>
          <span className="">{"  req.user = await verifyJwt(token);"}</span>
        </div>
        <div className="flex bg-secondary-container/20 text-secondary">
          <span className="w-11 shrink-0 text-right pr-3 text-secondary/70 select-none">
            + 15
          </span>
          <span className="">{"  return next();"}</span>
        </div>
        <div className="flex text-outline select-none">
          <span className="w-11 shrink-0 text-right pr-3 opacity-40">16</span>
          <span className="text-on-surface-variant">{"}"}</span>
        </div>
      </div>
    </div>
  );
}
