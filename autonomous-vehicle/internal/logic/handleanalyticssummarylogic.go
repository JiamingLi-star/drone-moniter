package logic

import (
	"context"
	"time"

	"autonomous-vehicle/internal/svc"
	"autonomous-vehicle/internal/types"

	"github.com/zeromicro/go-zero/core/logx"
)

type HandleVehicleAnalyticsSummaryLogic struct {
	logx.Logger
	ctx    context.Context
	svcCtx *svc.ServiceContext
}

func NewHandleVehicleAnalyticsSummaryLogic(ctx context.Context, svcCtx *svc.ServiceContext) *HandleVehicleAnalyticsSummaryLogic {
	return &HandleVehicleAnalyticsSummaryLogic{
		Logger: logx.WithContext(ctx),
		ctx:    ctx,
		svcCtx: svcCtx,
	}
}

func (l *HandleVehicleAnalyticsSummaryLogic) HandleVehicleAnalyticsSummary(req *types.AnalyticsSummaryReq) (*types.AnalyticsSummaryResp, error) {
	start, end, err := parseTimeRange(req.Start, req.End)
	if err != nil {
		return nil, err
	}

	totalVehicles, err := l.svcCtx.Dao.QueryDistinctVinCount(start, end)
	if err != nil {
		return nil, err
	}

	onlineVehicles, err := l.svcCtx.Dao.QueryOnlineCount(end.Add(-5*time.Minute), end)
	if err != nil {
		return nil, err
	}

	avgSpeed, err := l.svcCtx.Dao.QueryMeanField(start, end, "speed")
	if err != nil {
		return nil, err
	}

	avgBattery, err := l.svcCtx.Dao.QueryMeanField(start, end, "realBattery")
	if err != nil {
		return nil, err
	}

	totalMileage, err := l.svcCtx.Dao.QueryMileageDeltaSum(start, end)
	if err != nil {
		return nil, err
	}

	return &types.AnalyticsSummaryResp{
		Code: "0",
		Msg:  "ok",
		Data: types.AnalyticsSummaryData{
			TotalVehicles:  totalVehicles,
			OnlineVehicles: onlineVehicles,
			AvgSpeed:       avgSpeed,
			AvgBattery:     avgBattery,
			TotalMileage:   totalMileage,
			LastUpdated:    end.Format(time.RFC3339),
		},
	}, nil
}
