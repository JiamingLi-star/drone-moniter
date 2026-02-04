package logic

import (
	"context"

	"autonomous-vehicle/internal/svc"
	"autonomous-vehicle/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type HandleVehicleAnalyticsTimeSeriesLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewHandleVehicleAnalyticsTimeSeriesLogic(ctx context.Context, svcCtx *svc.ServiceContext) *HandleVehicleAnalyticsTimeSeriesLogic {
	return &HandleVehicleAnalyticsTimeSeriesLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *HandleVehicleAnalyticsTimeSeriesLogic) HandleVehicleAnalyticsTimeSeries(req *types.AnalyticsTimeSeriesReq) (*types.AnalyticsTimeSeriesResp, error) {
	start, end, err := parseTimeRange(req.Start, req.End)
	if err != nil {
		return nil, err
	}
	window := normalizeWindow(req.Window)

	speedSeries, err := l.svcCtx.Dao.QueryMeanSeries(start, end, window, "speed")
	if err != nil {
		return nil, err
	}
	batterySeries, err := l.svcCtx.Dao.QueryMeanSeries(start, end, window, "realBattery")
	if err != nil {
		return nil, err
	}

	return &types.AnalyticsTimeSeriesResp{
		Code: "0",
		Msg:  "ok",
		Data: types.AnalyticsTimeSeriesData{
			Speed:   speedSeries,
			Battery: batterySeries,
		},
	}, nil
}
