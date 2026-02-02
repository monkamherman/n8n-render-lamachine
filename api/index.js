// API simple pour n8n-style automation sur Vercel
export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS",
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { url, method } = req;
  const path = url.replace("/api", "");

  try {
    // Route principale
    if (path === "/" && method === "GET") {
      return res.json({
        service: "n8n-compatible API",
        version: "1.0.0",
        status: "running",
        endpoints: {
          root: "/",
          health: "/health",
          webhook: "/webhook/:workflowId",
          workflows: "/workflows",
          executions: "/executions",
        },
        timestamp: new Date().toISOString(),
      });
    }

    // Health check
    if (path === "/health" && method === "GET") {
      return res.json({
        status: "healthy",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      });
    }

    // Webhook handler
    if (path.startsWith("/webhook/") && method === "POST") {
      const workflowId = path.split("/")[2];
      const webhookData = {
        workflowId,
        data: req.body,
        timestamp: new Date().toISOString(),
        executionId: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      };

      // Simuler un traitement de workflow
      console.log("Webhook received:", webhookData);

      return res.json({
        success: true,
        executionId: webhookData.executionId,
        message: "Webhook processed successfully",
        processedAt: new Date().toISOString(),
      });
    }

    // Lister les workflows (simulation)
    if (path === "/workflows" && method === "GET") {
      return res.json({
        workflows: [
          {
            id: "webhook-processor",
            name: "Webhook Processor",
            active: true,
            triggers: ["webhook"],
          },
          {
            id: "data-transformer",
            name: "Data Transformer",
            active: false,
            triggers: ["manual"],
          },
        ],
      });
    }

    // Lister les exécutions (simulation)
    if (path === "/executions" && method === "GET") {
      return res.json({
        executions: [
          {
            id: "exec_1234567890_abc123",
            workflowId: "webhook-processor",
            status: "success",
            startedAt: new Date(Date.now() - 60000).toISOString(),
            finishedAt: new Date().toISOString(),
          },
        ],
        total: 1,
      });
    }

    // Route non trouvée
    return res.status(404).json({
      error: "Endpoint not found",
      path,
      method,
      availableEndpoints: [
        "/health",
        "/webhook/:id",
        "/workflows",
        "/executions",
      ],
    });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
}
