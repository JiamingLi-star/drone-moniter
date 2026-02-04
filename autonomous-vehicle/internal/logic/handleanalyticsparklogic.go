package logic

import (
	"context"

	"autonomous-vehicle/internal/svc"
	"autonomous-vehicle/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type HandleVehicleAnalyticsParkLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewHandleVehicleAnalyticsParkLogic(ctx context.Context, svcCtx *svc.ServiceContext) *HandleVehicleAnalyticsParkLogic {
	return &HandleVehicleAnalyticsParkLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *HandleVehicleAnalyticsParkLogic) HandleVehicleAnalyticsPark(req *types.AnalyticsParkReq) (*types.AnalyticsParkResp, error) {
	start, end, err := parseTimeRange(req.Start, req.End)
	if err != nil {
		return nil, err
	}

	stats, err := l.svcCtx.Dao.QueryParkCounts(start, end)
	if err != nil {
		return nil, err
	}

	return &types.AnalyticsParkResp{
		Code: "0",
		Msg:  "ok",
		Data: stats,
	}, nil
}
