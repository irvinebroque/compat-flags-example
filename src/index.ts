import { Buffer } from "node:buffer";
// Flags
// - --experimental-local (use Miniflare V3, workerd locally)
// - nodejs_compat (use node APIs built into workerd)

// What I'm trying to do: Show AsyncLocalStorage, Buffer, Assert, working in local dev w/no polyfills

// A few relevant PRs:
// https://github.com/cloudflare/workers-sdk/pull/2539
// -- uses [NPXI] Installing... (npx --prefer-offline -y -p @miniflare/tre@3.0.0-next.8)
//
// https://github.com/cloudflare/miniflare/pull/478/files

// Local version of workerd is outdated:
// [mf:wrn] The latest compatibility date supported by the installed Cloudflare Workers Runtime is "2022-11-11",
// but you've requested "2023-02-06". Falling back to "2022-11-11"...
// service core:user:compat-flags-example: No such feature flag: nodejs_compat
// ✘ [ERROR] The Workers runtime failed to start. There is likely additional logging output above.

// what sets this?
// https://github.com/cloudflare/miniflare/pull/392
// https://github.com/cloudflare/workerd/blob/main/RELEASE.md#publishing-workerd (we publish to NPM)
// https://github.com/cloudflare/miniflare/blob/5ecaae2b482feb583d8eeca2310785ea4d68165c/packages/tre/package.json#L41 (^1.20221111.5)
// https://github.com/cloudflare/workerd/releases (only 3 releases)
// ➜  npm show workerd versions
// [
//   '0.0.1',        '0.20221111.0',
//   '0.20230115.0', '1.20220926.0',
//   '1.20220926.1', '1.20220926.2',
//   '1.20220926.3', '1.20221111.0',
//   '1.20221111.1', '1.20221111.2',
//   '1.20221111.3', '1.20221111.4',
//   '1.20221111.5', '1.20230115.0'
// ]
// porque?
//
//
// The latest Miniflare v3 is using workerd from Nov 2022:
// https://github.com/cloudflare/miniflare/blob/tre/packages/tre/package.json#L42
//
//
// ** Questions: **
// 1. How do we make sure that, when workerd is released, people can start using it in Wrangler right away?
// --- When a version of workerd is released, people need to be able to update their dev dependencies right away
// --- such that they can use what's been released in local dev.
// --- 
// --- If we don't do this, communicating the availability of new APIs is going to be painful and confusing.


export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
	// lifted from a test case
    const u32 = new Uint32Array([1953719668]);
    const buffer = Buffer.from(u32);
    if (buffer.length !== 1) {
      throw new Error(`Unexpected buffer length [${buffer.length}]`);
    }
    if (buffer[0] !== 116) {
      throw new Error(`Unexpected buffer value [${buffer[0]}]`);
    }
    u32.fill(0);
    return new Response(buffer);
  },
};
