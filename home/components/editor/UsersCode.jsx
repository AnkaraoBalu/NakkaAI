export default function UsersCode({ activeFile }) {
  return (
    <div
      tabIndex={0}
      role="region"
      aria-label="users.ts code preview"
      id="file-content-users"
      className={
        " flex-1 min-h-0 max-h-[320px] md:max-h-none p-2 sm:p-3 leading-[22px] overflow-auto [&_span]:whitespace-pre text-[12px] bg-surface-container-lowest select-text font-mono transition-opacity duration-150" +
        (activeFile === "users" ? "" : " hidden")
      }
    >
      <div className="w-max min-w-full">
        <div className="flex text-outline select-none">
          <span className="w-11 shrink-0 text-right pr-3 opacity-40">1</span>
          <span className="text-on-surface-variant">
            {"import { Router } from 'express';"}
          </span>
        </div>
        <div className="flex bg-secondary-container/20 text-secondary">
          <span className="w-11 shrink-0 text-right pr-3 text-secondary/70 select-none">
            + 2
          </span>
          <span className="text-secondary">
            {"import { verifyToken } from '../middleware/auth';"}
          </span>
        </div>
        <div className="flex text-outline select-none">
          <span className="w-11 shrink-0 text-right pr-3 opacity-40">3</span>
          <span className="text-on-surface-variant">
            const router = Router();
          </span>
        </div>
        <div className="flex text-outline select-none">
          <span className="w-11 shrink-0 text-right pr-3 opacity-40">4</span>
          <span></span>
        </div>
        <div className="flex bg-error-container/20 text-error">
          <span className="w-11 shrink-0 text-right pr-3 text-error/60 select-none">
            - 5
          </span>
          <span className="">
            {"router.get('/profile', async (req, res) => {"}
          </span>
        </div>
        <div className="flex bg-secondary-container/20 text-secondary">
          <span className="w-11 shrink-0 text-right pr-3 text-secondary/70 select-none">
            + 5
          </span>
          <span className="">
            {"router.get('/profile', verifyToken, async (req, res) => {"}
          </span>
        </div>
        <div className="flex text-outline select-none">
          <span className="w-11 shrink-0 text-right pr-3 opacity-40">6</span>
          <span className="text-on-surface-variant">
            {"  return res.json({ status: 'ok', user: req.user });"}
          </span>
        </div>
        <div className="flex text-outline select-none">
          <span className="w-11 shrink-0 text-right pr-3 opacity-40">7</span>
          <span className="text-on-surface-variant">{"});"}</span>
        </div>
      </div>
    </div>
  );
}
