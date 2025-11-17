import { requireAuth } from "@clerk/express";

const clerkAuth = (req, res, next) => {
  console.log(`[ClerkAuth] Incoming request: ${req.method} ${req.originalUrl}`);

  const wrapped = requireAuth({
    onError: (err, req, res, next) => {
      console.error("[ClerkAuth] Clerk auth error:", err?.message || err);
      res.status(401).json({ error: "Unauthorized", details: err?.message || err });
    },
  });

  try {
    wrapped(req, res, (err) => {
      if (err) {
        console.error("[ClerkAuth] Middleware error:", err);
        return next(err);
      }
      console.log("[ClerkAuth] ✅ Authentication check passed");
      next();
    });
  } catch (err) {
    console.error("[ClerkAuth] ❌ Exception thrown in Clerk requireAuth:", err);
    next(err);
  }
};

export default clerkAuth;
