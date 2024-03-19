import { Application, Router } from 'https://deno.land/x/oak@v12.6.1/mod.ts'

const router = new Router();

router
  .get("/api", async (context) => {
    const queryParams = context.request.url.searchParams;
    const domain = queryParams.get('domain');
    const type = queryParams.get('type') as Deno.RecordType;
  
    if (!domain || !type) {
      context.response.status = 400;
      context.response.body = "Missing 'domain' or 'type' query parameters";
      return;
    }
  
    try {
      const dnsRecords = await Deno.resolveDns(domain, type);
      context.response.body = { domain, type, dnsRecords };
    } catch (error) {
      context.response.status = 500;
      context.response.body = `Error resolving DNS: ${error.message}`;
    }
  })

const app = new Application()

app.use(router.routes())
app.use(router.allowedMethods())

await app.listen({ port: 54321 })