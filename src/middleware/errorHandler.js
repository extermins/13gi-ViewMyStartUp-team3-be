// Express 에러 핸들러 — 라우터에서 next(err)를 호출하면 이 함수로 넘어옴
// 인자가 반드시 (err, req, res, _next) 4개여야 Express가 에러 핸들러로 인식
export default function errorHandler(err, req, res, _next) {
  console.error('[Error]', err.message)

  // err.status가 없으면 500 (서버 내부 오류)으로 처리
  const status = err.status || 500
  res.status(status).json({ message: err.message || '서버 오류가 발생했습니다' })
}
