package handler

import (
	"net/http"

	"autonomous-vehicle/internal/logic"
	"autonomous-vehicle/internal/svc"
	"autonomous-vehicle/internal/types"

	"github.com/zeromicro/go-zero/rest/httpx"
)

func HandleVehicleAnalyticsParkHandler(svcCtx *svc.ServiceContext) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		var req types.AnalyticsParkReq
		if err := httpx.Parse(r, &req); err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
			return
		}

		l := logic.NewHandleVehicleAnalyticsParkLogic(r.Context(), svcCtx)
		resp, err := l.HandleVehicleAnalyticsPark(&req)
		if err != nil {
			httpx.ErrorCtx(r.Context(), w, err)
		} else {
			httpx.OkJsonCtx(r.Context(), w, resp)
		}
	}
}
