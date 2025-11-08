-- Create functions to increment campaign metrics
CREATE OR REPLACE FUNCTION public.increment_campaign_impressions(campaign_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.ad_campaigns
  SET impressions = impressions + 1
  WHERE id = campaign_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE FUNCTION public.increment_campaign_clicks(campaign_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.ad_campaigns
  SET clicks = clicks + 1
  WHERE id = campaign_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Grant execute permissions
GRANT EXECUTE ON FUNCTION public.increment_campaign_impressions TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_campaign_impressions TO anon;
GRANT EXECUTE ON FUNCTION public.increment_campaign_clicks TO authenticated;
GRANT EXECUTE ON FUNCTION public.increment_campaign_clicks TO anon;