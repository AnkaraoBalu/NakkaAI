import { Controller, Post, Req, Res } from "@nestjs/common";
import type { Request, Response } from "express";
import { ProxyService } from "./proxy.service.js";

// The AI endpoints the VS Code extension calls, at the domain root.
// main.ts lists them in the global prefix's exclude list.
@Controller("v1")
export class ProxyController {
  constructor(private readonly proxy: ProxyService) {}

  // Anthropic models (claude-…): Anthropic Messages format.
  @Post("messages")
  messages(@Req() req: Request, @Res() res: Response) {
    return this.proxy.handle(req, res, "messages");
  }

  // OpenAI, Google and xAI models: OpenAI Chat Completions format.
  @Post("chat/completions")
  chat(@Req() req: Request, @Res() res: Response) {
    return this.proxy.handle(req, res, "chat");
  }
}
