"use client";

import { useEffect, useState } from "react";
import { Field, Input, Button, BlueprintCorners } from "@posselect/ui";

type Me = { email: string; name: string };

const CUSTOMER_BASE_URL =
  process.env.NEXT_PUBLIC_CUSTOMER_BASE_URL ?? "https://customer.posselect.com";
const HOME_BASE_URL = process.env.NEXT_PUBLIC_HOME_BASE_URL ?? "https://www.posselect.com";

const loginUrl = `${CUSTOMER_BASE_URL}/login?redirect_uri=${HOME_BASE_URL}/profile`;

export default function ProfilePage() {
  const [me, setMe] = useState<Me | null>(null);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [emailChanged, setEmailChanged] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then((res) => {
        if (!res.ok) throw new Error("unauthorized");
        return res.json();
      })
      .then((data: Me) => {
        setMe(data);
        setEmail(data.email);
        setName(data.name ?? "");
      })
      .catch(() => setError("로그인이 필요합니다."));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    if (!email || !name) {
      setError("이메일과 이름은 비워둘 수 없습니다.");
      return;
    }
    const body: { email?: string; name?: string; password?: string } = {};
    if (me && email !== me.email) body.email = email;
    if (me && name !== me.name) body.name = name;
    if (password) body.password = password;

    if (Object.keys(body).length === 0) {
      setMessage("변경된 내용이 없습니다.");
      return;
    }

    try {
      const res = await fetch("/api/auth/me", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const updated: Me = await res.json();
        setMe(updated);
        setPassword("");
        if (body.email) {
          setEmailChanged(true);
        } else {
          setMessage("정보가 수정되었습니다.");
        }
      } else {
        setError("정보 수정에 실패했습니다.");
      }
    } catch {
      setError("정보 수정 중 오류가 발생했습니다.");
    }
  };

  if (error && !me) {
    return (
      <div style={{ maxWidth: 400, margin: "80px auto", padding: 32, textAlign: "center" }}>
        <p style={{ color: "var(--color-danger)" }}>{error}</p>
        <a href={loginUrl} style={{ color: "var(--color-accent)" }}>
          로그인하러 가기
        </a>
      </div>
    );
  }

  if (emailChanged) {
    return (
      <div
        className="card blueprint elev-sm"
        style={{
          maxWidth: 400,
          margin: "80px auto",
          padding: 32,
          textAlign: "center",
        }}
      >
        <BlueprintCorners />
        <h2 style={{ fontFamily: "var(--font-heading)", fontWeight: 600, marginBottom: 16 }}>
          이메일이 변경되었습니다
        </h2>
        <p style={{ marginBottom: 16, color: "var(--color-neutral-700)" }}>
          변경 사항을 반영하려면 다시 로그인해주세요.
        </p>
        <a href={loginUrl} style={{ color: "var(--color-accent)" }}>
          다시 로그인하기
        </a>
      </div>
    );
  }

  if (!me) {
    return null;
  }

  return (
    <div
      className="card blueprint elev-sm"
      style={{
        maxWidth: 400,
        margin: "80px auto",
        padding: 32,
      }}
    >
      <BlueprintCorners />
      <h2
        style={{
          fontFamily: "var(--font-heading)",
          fontWeight: 600,
          textAlign: "center",
          marginBottom: 24,
        }}
      >
        나의 정보
      </h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 16 }}>
          <Field label="이름">
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </Field>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Field label="이메일">
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Field>
        </div>
        <div style={{ marginBottom: 16 }}>
          <Field label="새 비밀번호 (변경 시에만 입력)">
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="변경하지 않으려면 비워두세요"
            />
          </Field>
        </div>
        {error && <div style={{ color: "var(--color-danger)", marginBottom: 16 }}>{error}</div>}
        {message && (
          <div style={{ color: "var(--color-success)", marginBottom: 16 }}>{message}</div>
        )}
        <Button type="submit" variant="primary" block>
          저장
        </Button>
      </form>
    </div>
  );
}
