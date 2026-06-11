import { useState } from "react";

const PLACEMENT_POINTS = { 1:12, 2:9, 3:8, 4:7, 5:6, 6:5, 7:4, 8:3, 9:2, 10:2, 11:1, 12:1 };
const getPlacementPts = (pos) => PLACEMENT_POINTS[pos] || 0;
const ADMIN_PASSWORD = "admin123";

const sampleTeams = [
  { id:1, name:"Alpha Squad",   captain:"xAlpha99",  email:"alpha@gmail.com", phone:"9876543210", ffId:"FF123456", players:["xAlpha99","KillMaster","ShadowFF","NightOwl"],  checkedIn:true,  wins:2, losses:1, paid:true  },
  { id:2, name:"BloodHawk",     captain:"BH_Leader", email:"bloodhawk@gmail.com", phone:"9123456780", ffId:"FF234567", players:["BH_Leader","RedEye","DarkWolf","IronFist"],      checkedIn:true,  wins:1, losses:2, paid:true  },
  { id:3, name:"Storm Riders",  captain:"StormKing", email:"storm@gmail.com", phone:"9001234567", ffId:"FF345678", players:["StormKing","ThunderBolt","FlashFF","BlazeX"],    checkedIn:false, wins:3, losses:0, paid:true  },
  { id:4, name:"Ghost Killers", captain:"GhostFF",   email:"ghost@gmail.com", phone:"9988776655", ffId:"FF456789", players:["GhostFF","Phantom","Wraith","Specter"],          checkedIn:true,  wins:2, losses:1, paid:false },
];

const sampleApplications = [
  { id:101, teamName:"Nova Blasters", captain:"NovaX", email:"nova@gmail.com", phone:"9111222333", ffId:"FF567890", players:"NovaX, FlashKing, RapidFire, IceSniper", entryFee:200, utr:"UTR123456789", status:"pending",  appliedAt:"10 min ago" },
  { id:102, teamName:"Dark Phoenix",  captain:"DarkPH", email:"darkph@gmail.com", phone:"9444555666", ffId:"FF678901", players:"DarkPH, AshWing, CrimsonBolt, NightHawk", entryFee:200, utr:"UTR987654321", status:"pending",  appliedAt:"25 min ago" },
  { id:103, teamName:"Cyber Wolves",  captain:"CyberW", email:"cyber@gmail.com", phone:"9777888999", ffId:"FF789012", players:"CyberW, DataKill, NetRaider, ByteSniper", entryFee:200, utr:"UTR456123789", status:"approved", appliedAt:"1 hr ago"   },
];

const RULES = [
  { title:"Match Format",       content:"Battle Royale — 6 teams per lobby. Best of 6 matches. Points accumulate across all matches." },
  { title:"Kill Points",        content:"1 point per kill. No cap on kill points per match." },
  { title:"Placement Points",   content:"Booyah=12, #2=9, #3=8, #4=7, #5=6, #6=5, #7=4, #8=3, #9-10=2, #11-12=1" },
  { title:"Check-in",           content:"All teams must check in 15 minutes before match start. Failure results in disqualification." },
  { title:"Disconnections",     content:"No remake for disconnections. Team must continue with remaining members." },
  { title:"Disputes",           content:"Submit screenshot evidence within 10 minutes of match end. Admin decision is final." },
  { title:"Fair Play",          content:"No hacking, emulators, or teaming. Instant ban and disqualification." },
  { title:"Prize Distribution", content:"1st: 50% | 2nd: 30% | 3rd: 20% of prize pool. Paid within 48 hours of tournament end." },
];

// ── ATOMS ─────────────────────────────────────────────────
function Badge({ color, children }) {
  const c = {
    green:{bg:"#0d2a1a",text:"#00e676",border:"#00e67633"},
    red:{bg:"#2a0d0d",text:"#ff1744",border:"#ff174433"},
    orange:{bg:"#2a1a0d",text:"#ff6b00",border:"#ff6b0033"},
    blue:{bg:"#0d1a2a",text:"#29b6f6",border:"#29b6f633"},
    gray:{bg:"#1a1a1a",text:"#888",border:"#33333366"},
  }[color]||{bg:"#1a1a1a",text:"#888",border:"#33333366"};
  return <span style={{background:c.bg,color:c.text,border:`1px solid ${c.border}`,borderRadius:6,padding:"2px 8px",fontSize:11,fontWeight:700,whiteSpace:"nowrap"}}>{children}</span>;
}
function Card({ children, style={} }) {
  return <div style={{background:"#13131a",borderRadius:14,padding:14,border:"1px solid #1e1e2e",marginBottom:10,...style}}>{children}</div>;
}
function Inp({ style={}, ...p }) {
  return <input {...p} style={{width:"100%",padding:"11px 13px",background:"#0a0a0f",border:"1px solid #2a2a3a",borderRadius:10,color:"#fff",fontSize:14,boxSizing:"border-box",outline:"none",...style}} />;
}
function Btn({ children, onClick, variant="primary", style={}, disabled=false }) {
  const v = {
    primary:{background:"linear-gradient(135deg,#ff6b00,#ff0055)",color:"#fff"},
    secondary:{background:"#1e1e2e",color:"#aaa",border:"1px solid #2a2a3a"},
    danger:{background:"#2a0d0d",color:"#ff1744",border:"1px solid #ff174433"},
    success:{background:"#0d2a1a",color:"#00e676",border:"1px solid #00e67633"},
    blue:{background:"#0d1a2a",color:"#29b6f6",border:"1px solid #29b6f633"},
  }[variant];
  return <button onClick={onClick} disabled={disabled} style={{padding:"12px 16px",border:"none",borderRadius:10,fontWeight:700,fontSize:14,cursor:disabled?"not-allowed":"pointer",width:"100%",opacity:disabled?0.5:1,...v,...style}}>{children}</button>;
}
function Label({ children }) {
  return <div style={{fontSize:11,color:"#666",marginBottom:5,letterSpacing:0.5,fontWeight:600}}>{children}</div>;
}

// ── ADMIN LOCK ────────────────────────────────────────────
function AdminLock({ onUnlock }) {
  const [pw, setPw] = useState(""); const [err, setErr] = useState(false); const [shake, setShake] = useState(false);
  const tryLogin = () => {
    if(pw===ADMIN_PASSWORD){onUnlock();}
    else{setErr(true);setShake(true);setPw("");setTimeout(()=>setShake(false),500);setTimeout(()=>setErr(false),2000);}
  };
  return (
    <div style={{minHeight:"100vh",background:"#0a0a0f",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",padding:24}}>
      <style>{`@keyframes shake{0%,100%{transform:translateX(0)}20%,60%{transform:translateX(-8px)}40%,80%{transform:translateX(8px)}}`}</style>
      <div style={{fontSize:56,marginBottom:8}}>🔐</div>
      <div style={{fontSize:22,fontWeight:800,color:"#ff6b00",marginBottom:4}}>Admin Access</div>
      <div style={{fontSize:13,color:"#555",marginBottom:32,textAlign:"center"}}>Enter your password to manage this tournament</div>
      <div style={{width:"100%",maxWidth:340,animation:shake?"shake 0.4s":"none"}}>
        <Inp type="password" placeholder="Admin password" value={pw} onChange={e=>setPw(e.target.value)} onKeyDown={e=>e.key==="Enter"&&tryLogin()} style={{marginBottom:10,fontSize:16,textAlign:"center",letterSpacing:4,border:err?"1px solid #ff1744":"1px solid #2a2a3a"}} />
        {err&&<div style={{textAlign:"center",color:"#ff1744",fontSize:12,marginBottom:8}}>❌ Wrong password</div>}
        <Btn onClick={tryLogin}>Unlock Dashboard</Btn>
      </div>
      <div style={{marginTop:24,fontSize:11,color:"#333",textAlign:"center"}}>Default: <span style={{color:"#555",fontFamily:"monospace"}}>admin123</span></div>
    </div>
  );
}

// ── PUBLIC REGISTRATION FORM ──────────────────────────────
function Register({ tournamentName, entryFee, upiId, maxTeams, approvedCount, onSubmit }) {
  const [step, setStep] = useState(1); // 1=form 2=payment 3=done
  const [form, setForm] = useState({ teamName:"", captain:"", email:"", phone:"", ffId:"", players:"", utr:"" });
  const [errors, setErrors] = useState({});

  const set = (k,v) => setForm(f=>({...f,[k]:v}));

  const validate1 = () => {
    const e = {};
    if(!form.teamName.trim()) e.teamName="Required";
    if(!form.captain.trim()) e.captain="Required";
    if(!form.email.includes("@")) e.email="Valid Gmail required";
    if(form.phone.length<10) e.phone="Valid phone required";
    if(!form.ffId.trim()) e.ffId="Required";
    if(!form.players.trim()) e.players="Required";
    setErrors(e);
    return Object.keys(e).length===0;
  };

  const isFull = approvedCount >= maxTeams;

  if(isFull && step===1) return (
    <div style={{padding:16}}>
      <Card style={{textAlign:"center",padding:"40px 20px",border:"1px solid #ff174433"}}>
        <div style={{fontSize:48}}>🔒</div>
        <div style={{fontSize:18,fontWeight:800,color:"#ff1744",marginTop:12}}>Tournament Full</div>
        <div style={{fontSize:13,color:"#888",marginTop:8}}>All {maxTeams} slots have been filled. Check back for future tournaments.</div>
      </Card>
    </div>
  );

  if(step===3) return (
    <div style={{padding:16}}>
      <Card style={{textAlign:"center",padding:"40px 20px",background:"linear-gradient(135deg,#0d2a1a,#1a2a0d)",border:"1px solid #00e67633"}}>
        <div style={{fontSize:56}}>🎉</div>
        <div style={{fontSize:20,fontWeight:800,color:"#00e676",marginTop:12}}>Registration Submitted!</div>
        <div style={{fontSize:13,color:"#aaa",marginTop:8,lineHeight:1.6}}>
          Your team <strong style={{color:"#fff"}}>{form.teamName}</strong> has been submitted for review.<br/>
          The admin will verify your payment and approve your slot.<br/>
          You'll be notified via the WhatsApp/Discord group.
        </div>
        <div style={{marginTop:20,background:"#0a0a0f",borderRadius:10,padding:"12px",fontSize:12,color:"#888"}}>
          <div>UTR/Reference: <strong style={{color:"#ff6b00",fontFamily:"monospace"}}>{form.utr}</strong></div>
          <div style={{marginTop:4}}>Amount Paid: <strong style={{color:"#fff"}}>₹{entryFee}</strong></div>
        </div>
        <Btn onClick={()=>{setStep(1);setForm({teamName:"",captain:"",email:"",phone:"",ffId:"",players:"",utr:""});}} style={{marginTop:16}} variant="secondary">Register Another Team</Btn>
      </Card>
    </div>
  );

  return (
    <div style={{padding:16}}>
      {/* Progress */}
      <div style={{display:"flex",gap:8,marginBottom:16,alignItems:"center"}}>
        {["Team Info","Payment","Done"].map((s,i)=>(
          <div key={i} style={{display:"flex",alignItems:"center",gap:8,flex:i<2?1:0}}>
            <div style={{display:"flex",alignItems:"center",gap:6}}>
              <div style={{width:24,height:24,borderRadius:"50%",background:step>i+1?"#00e676":step===i+1?"#ff6b00":"#1e1e2e",display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:800,color:step>=i+1?"#fff":"#555",flexShrink:0}}>
                {step>i+1?"✓":i+1}
              </div>
              <span style={{fontSize:11,color:step===i+1?"#ff6b00":step>i+1?"#00e676":"#555",fontWeight:700}}>{s}</span>
            </div>
            {i<2&&<div style={{flex:1,height:2,background:step>i+1?"#00e676":"#1e1e2e",borderRadius:2}}/>}
          </div>
        ))}
      </div>

      {/* Slots left */}
      <Card style={{background:"linear-gradient(135deg,#1a1200,#2a1800)",border:"1px solid #ff6b0033",marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div>
            <div style={{fontSize:13,fontWeight:700,color:"#ff6b00"}}>{tournamentName}</div>
            <div style={{fontSize:11,color:"#888",marginTop:2}}>Entry Fee: ₹{entryFee} per team</div>
          </div>
          <div style={{textAlign:"right"}}>
            <div style={{fontSize:18,fontWeight:800,color:maxTeams-approvedCount<=2?"#ff1744":"#00e676"}}>{maxTeams-approvedCount}</div>
            <div style={{fontSize:10,color:"#555"}}>SLOTS LEFT</div>
          </div>
        </div>
        <div style={{background:"#0a0a0f",borderRadius:6,height:6,overflow:"hidden",marginTop:10}}>
          <div style={{height:"100%",background:"linear-gradient(90deg,#ff6b00,#ff0055)",width:`${(approvedCount/maxTeams)*100}%`,transition:"width 0.4s"}}/>
        </div>
        <div style={{fontSize:10,color:"#555",marginTop:4,textAlign:"right"}}>{approvedCount}/{maxTeams} slots filled</div>
      </Card>

      {/* STEP 1 — Team Info */}
      {step===1 && (
        <Card>
          <div style={{fontSize:11,color:"#ff6b00",fontWeight:700,letterSpacing:1,marginBottom:14}}>TEAM INFORMATION</div>

          <Label>Team Name *</Label>
          <Inp placeholder="e.g. Shadow Wolves" value={form.teamName} onChange={e=>set("teamName",e.target.value)} style={{marginBottom:errors.teamName?4:12,borderColor:errors.teamName?"#ff1744":"#2a2a3a"}} />
          {errors.teamName&&<div style={{fontSize:11,color:"#ff1744",marginBottom:8}}>⚠ {errors.teamName}</div>}

          <Label>Captain's Name / Game ID *</Label>
          <Inp placeholder="Your Free Fire username" value={form.captain} onChange={e=>set("captain",e.target.value)} style={{marginBottom:errors.captain?4:12,borderColor:errors.captain?"#ff1744":"#2a2a3a"}} />
          {errors.captain&&<div style={{fontSize:11,color:"#ff1744",marginBottom:8}}>⚠ {errors.captain}</div>}

          <Label>Free Fire UID *</Label>
          <Inp placeholder="Your 9-digit FF UID" value={form.ffId} onChange={e=>set("ffId",e.target.value)} style={{marginBottom:errors.ffId?4:12,borderColor:errors.ffId?"#ff1744":"#2a2a3a"}} />
          {errors.ffId&&<div style={{fontSize:11,color:"#ff1744",marginBottom:8}}>⚠ {errors.ffId}</div>}

          <Label>Gmail Address *</Label>
          <Inp type="email" placeholder="captain@gmail.com" value={form.email} onChange={e=>set("email",e.target.value)} style={{marginBottom:errors.email?4:12,borderColor:errors.email?"#ff1744":"#2a2a3a"}} />
          {errors.email&&<div style={{fontSize:11,color:"#ff1744",marginBottom:8}}>⚠ {errors.email}</div>}

          <Label>WhatsApp Number *</Label>
          <Inp type="tel" placeholder="10-digit mobile number" value={form.phone} onChange={e=>set("phone",e.target.value)} style={{marginBottom:errors.phone?4:12,borderColor:errors.phone?"#ff1744":"#2a2a3a"}} />
          {errors.phone&&<div style={{fontSize:11,color:"#ff1744",marginBottom:8}}>⚠ {errors.phone}</div>}

          <Label>All 4 Player IDs (comma separated) *</Label>
          <Inp placeholder="Player1, Player2, Player3, Player4" value={form.players} onChange={e=>set("players",e.target.value)} style={{marginBottom:errors.players?4:12,borderColor:errors.players?"#ff1744":"#2a2a3a"}} />
          {errors.players&&<div style={{fontSize:11,color:"#ff1744",marginBottom:8}}>⚠ {errors.players}</div>}

          <Btn onClick={()=>{if(validate1())setStep(2);}}>Continue to Payment →</Btn>
        </Card>
      )}

      {/* STEP 2 — Payment */}
      {step===2 && (
        <Card>
          <div style={{fontSize:11,color:"#ff6b00",fontWeight:700,letterSpacing:1,marginBottom:14}}>PAYMENT</div>

          <div style={{background:"linear-gradient(135deg,#0d1a2a,#1a0d2a)",borderRadius:12,padding:16,marginBottom:14,border:"1px solid #29b6f633",textAlign:"center"}}>
            <div style={{fontSize:12,color:"#888",marginBottom:4}}>Pay Entry Fee via UPI</div>
            <div style={{fontSize:28,fontWeight:800,color:"#fff",marginBottom:4}}>₹{entryFee}</div>
            <div style={{fontSize:14,color:"#29b6f6",fontWeight:700,fontFamily:"monospace",background:"#0a0a0f",borderRadius:8,padding:"8px 12px",display:"inline-block",marginBottom:8}}>{upiId}</div>
            <div style={{fontSize:11,color:"#555"}}>Pay via GPay, PhonePe, Paytm, or any UPI app</div>
          </div>

          <div style={{background:"#0a0a0f",borderRadius:10,padding:12,marginBottom:14,border:"1px solid #2a2a3a"}}>
            <div style={{fontSize:11,color:"#888",marginBottom:6}}>PAYMENT STEPS</div>
            {["Open GPay / PhonePe / Paytm","Send ₹"+entryFee+" to the UPI ID above","Copy the UTR / Transaction ID","Paste it below and submit"].map((s,i)=>(
              <div key={i} style={{display:"flex",gap:8,alignItems:"flex-start",marginBottom:6}}>
                <div style={{width:18,height:18,borderRadius:"50%",background:"#ff6b00",color:"#fff",fontSize:10,fontWeight:800,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0,marginTop:1}}>{i+1}</div>
                <div style={{fontSize:12,color:"#aaa"}}>{s}</div>
              </div>
            ))}
          </div>

          <Label>UTR / Transaction Reference ID *</Label>
          <Inp placeholder="e.g. UTR123456789012" value={form.utr} onChange={e=>set("utr",e.target.value)} style={{marginBottom:14,fontFamily:"monospace",letterSpacing:1}} />

          <Btn onClick={()=>{if(form.utr.trim().length>5){onSubmit(form);setStep(3);}else setErrors({utr:"Enter valid UTR"});}}>
            ✅ Submit Registration
          </Btn>
          <Btn onClick={()=>setStep(1)} variant="secondary" style={{marginTop:8}}>← Back</Btn>
        </Card>
      )}
    </div>
  );
}

// ── ADMIN: APPLICATIONS ───────────────────────────────────
function Applications({ applications, setApplications, teams, setTeams }) {
  const [expanded, setExpanded] = useState(null);
  const pending = applications.filter(a=>a.status==="pending").length;

  const approve = (app) => {
    setApplications(applications.map(a=>a.id===app.id?{...a,status:"approved"}:a));
    const playerList = app.players.split(",").map(p=>p.trim());
    setTeams([...teams,{
      id:Date.now(), name:app.teamName, captain:app.captain,
      email:app.email, phone:app.phone, ffId:app.ffId,
      players:playerList, checkedIn:false, wins:0, losses:0, paid:true
    }]);
  };

  const reject = (id) => setApplications(applications.map(a=>a.id===id?{...a,status:"rejected"}:a));

  const sColors={pending:"orange",approved:"green",rejected:"red"};
  const sLabels={pending:"⏳ Pending",approved:"✅ Approved",rejected:"✗ Rejected"};

  return (
    <div style={{padding:16}}>
      <Card style={{background:"linear-gradient(135deg,#0d1a2a,#0d2a1a)",border:"1px solid #00e67633",marginBottom:14}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{fontSize:12,color:"#00e676",fontWeight:700}}>🔐 Admin — Applications</div>
          {pending>0&&<Badge color="orange">{pending} pending</Badge>}
        </div>
      </Card>

      {applications.length===0&&(
        <Card style={{textAlign:"center",padding:"32px 20px",border:"1px dashed #2a2a3a"}}>
          <div style={{fontSize:40}}>📋</div>
          <div style={{color:"#555",marginTop:8,fontSize:14}}>No applications yet.</div>
        </Card>
      )}

      {applications.map(app=>(
        <Card key={app.id} style={{border:app.status==="pending"?"1px solid #ff6b0033":app.status==="approved"?"1px solid #00e67633":"1px solid #1e1e2e"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
            <div>
              <div style={{fontWeight:800,fontSize:15}}>{app.teamName}</div>
              <div style={{fontSize:11,color:"#888",marginTop:2}}>👑 {app.captain} · {app.appliedAt}</div>
            </div>
            <div style={{display:"flex",gap:6,alignItems:"center"}}>
              <Badge color={sColors[app.status]}>{sLabels[app.status]}</Badge>
              <button onClick={()=>setExpanded(expanded===app.id?null:app.id)} style={{background:"#1e1e2e",border:"none",color:"#aaa",borderRadius:8,width:28,height:28,cursor:"pointer",fontSize:12}}>{expanded===app.id?"▲":"▼"}</button>
            </div>
          </div>

          {expanded===app.id&&(
            <div style={{borderTop:"1px solid #1e1e2e",paddingTop:12,marginTop:4}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:12}}>
                {[["📧 Gmail",app.email],["📱 WhatsApp",app.phone],["🎮 FF UID",app.ffId],["💰 UTR",app.utr]].map(([k,v])=>(
                  <div key={k} style={{background:"#0a0a0f",borderRadius:8,padding:"8px 10px"}}>
                    <div style={{fontSize:10,color:"#555",marginBottom:2}}>{k}</div>
                    <div style={{fontSize:12,color:"#fff",fontWeight:600,wordBreak:"break-all"}}>{v}</div>
                  </div>
                ))}
              </div>
              <div style={{background:"#0a0a0f",borderRadius:8,padding:"8px 10px",marginBottom:12}}>
                <div style={{fontSize:10,color:"#555",marginBottom:2}}>👥 PLAYERS</div>
                <div style={{fontSize:12,color:"#fff"}}>{app.players}</div>
              </div>
              <div style={{background:"linear-gradient(135deg,#0d1a2a,#1a0d2a)",borderRadius:8,padding:"8px 10px",marginBottom:12,border:"1px solid #29b6f633"}}>
                <div style={{fontSize:10,color:"#29b6f6",marginBottom:2}}>💳 ENTRY FEE PAID</div>
                <div style={{fontSi
